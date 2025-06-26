import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import AutoModel


class CrossModalAttention(nn.Module):
    def __init__(self, text_dim, num_heads=32):
        super().__init__()
        # Project speech features to text dimension for both directions
        self.speech_proj = nn.Linear(1024, text_dim)
        
        # Two cross-attention layers for bidirectional interaction
        self.text_to_speech_attn = nn.MultiheadAttention(
            embed_dim=text_dim,
            num_heads=num_heads,
            dropout=0.2,
            bias=False,
            batch_first=True
        )
        # self.speech_to_text_attn = nn.MultiheadAttention(
        #     embed_dim=text_dim,  # Uses text_dim since speech is projected
        #     num_heads=num_heads,
        #     dropout=0.2,
        #     bias=False,
        #     batch_first=True
        # )
        
    def forward(self, text_seq, speech_seq, text_mask=None, speech_mask=None):
        # Project speech to text dimension
        speech_seq = self.speech_proj(speech_seq)
        
        # Text attends to speech (text as query, speech as key/value)
        text_attended, _ = self.text_to_speech_attn(
            query=text_seq,
            key=speech_seq,
            value=speech_seq,
            key_padding_mask=speech_mask
        )
        
        # # Speech attends to text (projected speech as query, text as key/value)
        # speech_attended, _ = self.speech_to_text_attn(
        #     query=speech_seq,
        #     key=text_seq,
        #     value=text_seq,
        #     key_padding_mask=text_mask
        # )
        
        # return torch.cat([text_attended, speech_attended],dim=1)
        return text_attended
    

class PositionwiseFeedForward(nn.Module):
    def __init__(self, embed_dim, ff_dim, dropout=0.1):
        super(PositionwiseFeedForward, self).__init__()
        self.fc1 = nn.Linear(embed_dim, ff_dim)
        self.fc2 = nn.Linear(ff_dim, embed_dim)
        self.relu = nn.GELU()
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.fc2(x)
        return x
        
class FlashMultiHeadSelfAttention(nn.Module):
    def __init__(self, embed_dim, num_heads, dropout=0.1):
        """Multi-Head Self-Attention using PyTorch Flash Attention"""
        
        super(FlashMultiHeadSelfAttention, self).__init__()
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads
        self.embed_dim = embed_dim

        assert self.head_dim * num_heads == embed_dim, "Embedding size must be divisible by number of heads"

        # Combined QKV projection
        self.qkv_proj = nn.Linear(embed_dim, embed_dim * 3, bias=False)
        self.out_proj = nn.Linear(embed_dim, embed_dim, bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        batch_size, seq_length, embed_dim = x.shape

        # Compute Q, K, V in a single operation
        qkv = self.qkv_proj(x).reshape(batch_size, seq_length, 3, self.num_heads, self.head_dim)
        qkv = qkv.permute(2, 0, 3, 1, 4)  # (3, batch, heads, seq_len, head_dim)
        q, k, v = qkv[0], qkv[1], qkv[2]  # Split Q, K, V

        # Flash Attention (PyTorch 2.0+)
        attn_output = F.scaled_dot_product_attention(q, k, v, attn_mask=mask, dropout_p=self.dropout.p if self.training else 0)

        # Reshape back
        attn_output = attn_output.permute(0, 2, 1, 3).reshape(batch_size, seq_length, embed_dim)

        return self.out_proj(attn_output)
    

class TransformerEncoderLayer(nn.Module):
    def __init__(self, embed_dim, num_heads, ff_dim, dropout=0.1):
        super(TransformerEncoderLayer, self).__init__()
        self.self_attn = FlashMultiHeadSelfAttention(embed_dim, num_heads, dropout)
        self.norm1 = nn.LayerNorm(embed_dim)
        self.norm2 = nn.LayerNorm(embed_dim)
        self.ffn = PositionwiseFeedForward(embed_dim, ff_dim, dropout)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        # Flash Attention + Residual Connection
        x_norm = self.norm1(x)
        attn_output = self.self_attn(x_norm, mask)
        x = x + (attn_output)  # Add & Norm

        # Feed-Forward Network + Residual Connection
        x_norm = self.norm2(x)
        ffn_output = self.ffn(x_norm)
        x = x + self.dropout(ffn_output)  # Add & Norm
        return x
        
class TransformerEncoder(nn.Module):
    def __init__(self, num_layers, embed_dim, num_heads, ff_dim, dropout=0.1):
        super(TransformerEncoder, self).__init__()
        self.layers = nn.ModuleList([
            TransformerEncoderLayer(embed_dim, num_heads, ff_dim, dropout)
            for _ in range(num_layers)
        ])
    def forward(self, x, mask=None):
        for layer in self.layers:
            x = layer(x, mask)
        return x



class EnglishModel(nn.Module):
    def __init__(self,llm_name,speech_encoder_name,freeze_llm=False,freeze_speech_encoder=False,freeze_feature_extractor=False,freeze_encoder_layers=0):
        super(EnglishModel,self).__init__()
        
        self.llm = AutoModel.from_pretrained(llm_name)
        self.speech_encoder = AutoModel.from_pretrained(speech_encoder_name)
        if freeze_llm:
            for param in self.llm.parameters():
                param.requires_grad = False
        
        if freeze_speech_encoder:
            for param in self.speech_encoder.parameters():
                param.requires_grad = False
                
        if freeze_feature_extractor:            
            for layer in self.speech_encoder.feature_extractor.conv_layers.parameters():
                param.requires_grad = False
                
            for param in self.speech_encoder.feature_projection.parameters():
                param.requires_grad = False
            
            for param in self.speech_encoder.encoder.pos_conv_embed.parameters():
                param.requires_grad = False
        
        if freeze_encoder_layers:
            encoder_layers = self.speech_encoder.encoder.layers  # Common path for transformer models
            num_layers = len(encoder_layers)
            layers_to_freeze = min(freeze_encoder_layers, num_layers)  # Handle models with <40 layers
            for layer in encoder_layers[:layers_to_freeze]:
                for param in layer.parameters():
                    param.requires_grad = False

        # self.adapter = TransformerAdapter(
        #     input_dim=self.speech_encoder.config.hidden_size,
        #     output_dim=1024,
        #     num_layers=2
        # )

        self.cross_attention = CrossModalAttention(self.llm.config.hidden_size)
        self.encoder = TransformerEncoder(6, self.llm.config.hidden_size, 32, 2048, 0.2)
        
        # self.shared_encoder = nn.Sequential(
        #     nn.Linear(3*self.llm.config.hidden_size, 768),
        #     nn.SiLU(),
        #     nn.Dropout(0.2),
        # )
        
        self.acc = nn.Sequential(
            nn.Linear(2560, 1024),  
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(1024, 256),    
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(256, 1)
        )

        self.flu = nn.Sequential(
            nn.Linear(2560, 1024),  
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(1024, 256),    
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(256, 1)
        )
        self.comp = nn.Sequential(
            nn.Linear(2560, 512),  
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(512, 128),    
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(128, 1)
        )
        
        self.prod = nn.Sequential(
            nn.Linear(2560, 1024),  
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(1024, 256),    
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(256, 1)
        )
        self.tot = nn.Sequential(
            nn.Linear(2560, 512),  
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(512, 128),    
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(128, 1)
        )
        
        self.cross_attention.apply(self._init_weights)
        self.encoder.apply(self._init_weights)
        self.acc.apply(self._init_weights)
        self.flu.apply(self._init_weights)
        self.comp.apply(self._init_weights)
        self.prod.apply(self._init_weights)
        self.tot.apply(self._init_weights)

    
        
    def forward(self,input_ids,waveforms,attention_masks):
        
        text_features = torch.cat(self.llm(input_ids=input_ids,attention_mask=attention_masks,output_hidden_states=True).hidden_states[-5:],dim=1)
        speech_features = torch.cat(self.speech_encoder(waveforms,output_hidden_states=True).hidden_states[-5:],dim=1)
        # speech_features = self.adapter(speech_features)
        
        cross_attn = self.cross_attention(text_features,speech_features)
        encoded=self.encoder(cross_attn)
        

        # Pooling operations
        text_pool = torch.mean(text_features, dim=1)  # [B, D]
        attended_pool = torch.mean(encoded, dim=1)  # [B, D]
        speech_pool = torch.mean(speech_features, dim=1)  # [B, D]

        
        combined_features = torch.cat([text_pool, attended_pool,speech_pool], dim=1)
        # combined_features = self.shared_encoder(combined_features)
        
        acc = self.acc(combined_features)
        flu = self.flu(combined_features)
        comp = self.comp(combined_features)
        prod = self.prod(combined_features)
        tot = self.tot(combined_features)
        
        return torch.cat([acc, flu, comp,prod,tot], dim=1)
    
    def _init_weights(self,module):
        if isinstance(module,nn.Linear):
            std =0.02
            torch.nn.init.normal_(module.weight,mean=0.0,std=std)
            if module.bias is not None:
                torch.nn.init.zeros_(module.bias)