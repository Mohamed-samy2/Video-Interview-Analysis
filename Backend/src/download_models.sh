#!/bin/bash
set -e

echo "Downloading AI models..."

cd "$(dirname "$0")"

# Create directories
mkdir -p Ai/Audio_Model
mkdir -p Ai/Video_Model
mkdir -p Ai/Text_Model/Models

# Download Video model
wget https://huggingface.co/mohamedsamyy/PRVIA_Video_Personality_Traits/resolve/main/X3D_Third_CheckPoint.pth?download=true \
    -O Ai/Video_Model/X3D_Third_CheckPoint.pth

# # Download Audio model
# wget https://huggingface.co/your-username/video-model/resolve/main/x3d_model.pth \
#     -O Ai/Audio_Model/EnglishModel_weights_best_epoch.pth

# Download Text model
wget https://huggingface.co/mohamedsamyy/PRVIA_Text_Personality_Traits/resolve/main/AGR.h5?download=true \
    -O Ai/Text_Model/Models/AGR.h5

wget https://huggingface.co/mohamedsamyy/PRVIA_Text_Personality_Traits/resolve/main/CONN.h5?download=true \
    -O Ai/Text_Model/Models/CONN.h5

wget https://huggingface.co/mohamedsamyy/PRVIA_Text_Personality_Traits/resolve/main/EXT.h5?download=true \
    -O Ai/Text_Model/Models/EXT.h5

wget https://huggingface.co/mohamedsamyy/PRVIA_Text_Personality_Traits/resolve/main/NEU.h5?download=true \
    -O Ai/Text_Model/Models/NEU.h5

wget https://huggingface.co/mohamedsamyy/PRVIA_Text_Personality_Traits/resolve/main/OPN.h5?download=true \
    -O Ai/Text_Model/Models/OPN.h5

echo "All models downloaded successfully."
