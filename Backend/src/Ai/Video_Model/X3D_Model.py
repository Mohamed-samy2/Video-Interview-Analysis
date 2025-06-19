# import torch.nn.functional as F
# import torch
# import torch.nn as nn

# class x3d_model(nn.Module) :
#     def __init__(self,model_name):
#         super().__init__()
#         self.feature_extractor=torch.hub.load('facebookresearch/pytorchvideo', model_name, pretrained=True)

#         self.prod1 = nn.Sequential(
#             nn.Linear(400, 128),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(128, 64),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(64, 1)
#         )

#         self.prod2 = nn.Sequential(
#             nn.Linear(400, 128),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(128, 64),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(64, 1)
#         )

#         self.prod3 = nn.Sequential(
#             nn.Linear(400, 128),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(128, 64),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(64, 1)
#         )

#         self.prod4 = nn.Sequential(
#             nn.Linear(400, 128),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(128, 64),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(64, 1)
#         )

#         self.prod5 = nn.Sequential(
#             nn.Linear(400, 128),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(128, 64),
#             nn.GELU(),
#             nn.Dropout(0.2),
#             nn.Linear(64, 1)
#         )

#     def forward(self,frames):
#         features = self.feature_extractor(frames)
#         features = features.flatten(start_dim=1)  # Flatten everything except batch dimension

#         out1=self.prod1(features)
#         out2=self.prod2(features)
#         out3=self.prod3(features)
#         out4=self.prod4(features)
#         out5=self.prod5(features)


#         return torch.cat([out1,out2, out3, out4, out5 ], dim=1)