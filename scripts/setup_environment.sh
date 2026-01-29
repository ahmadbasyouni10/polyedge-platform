set -e 

echo "=========================================="
echo "PolyEdge Environment Setup"
echo "=========================================="
echo ""

if [ ! -f "README.md" ]; then
    echo "Error: Run this script from the project root directory"
    exit 1
fi

echo "Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi
python3 --version
echo "✓ Python found"
echo ""

echo "Checking CUDA..."
if command -v nvidia-smi &> /dev/null; then
    echo "GPU Info:"
    nvidia-smi --query-gpu=name,memory.total --format=csv,noheader
    echo "✓ CUDA drivers found"
else
    echo "⚠ Warning: nvidia-smi not found. GPU may not be available."
fi
echo ""

echo "Creating virtual environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi
echo ""

echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

echo "Upgrading pip..."
pip install --upgrade pip
echo "✓ pip upgraded"
echo ""

echo "Installing PyTorch with CUDA support..."
echo "  (This may take a few minutes)"
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
echo "✓ PyTorch installed"
echo ""

echo "Installing ML libraries..."
pip install transformers datasets accelerate peft bitsandbytes trl
echo "✓ ML libraries installed"
echo ""

echo "Installing Unsloth (for faster training)..."
pip install unsloth[cu121] || echo "⚠ Unsloth installation failed (optional, continuing...)"
echo ""

echo "Installing data/API libraries..."
pip install requests pandas numpy beautifulsoup4 lxml aiohttp
echo "✓ Data libraries installed"
echo ""

echo "Creating requirements.txt..."
pip freeze > requirements.txt
echo "✓ requirements.txt created"
echo ""

echo "Creating directory structure..."
mkdir -p data/{raw,processed}
mkdir -p training/{scripts,checkpoints}
mkdir -p backend/{api,services}
mkdir -p frontend
mkdir -p docs
mkdir -p scripts
echo "✓ Directories created"
echo ""

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Activate environment: source venv/bin/activate"
echo "  2. Verify setup: python scripts/verify_setup.py"
echo "  3. Download data: python scripts/download_hf_dataset.py"
echo "  4. Test API: python scripts/test_polymarket_api.py"
echo "  5. Explore data: python scripts/explore_data.py"
echo ""
