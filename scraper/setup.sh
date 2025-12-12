#!/bin/bash

echo "🔧 Setting up Facebook Job Scraper..."

# Kiểm tra Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 chưa được cài đặt"
    echo "Chạy: sudo apt update && sudo apt install python3 python3-pip python3-venv"
    exit 1
fi

echo "✓ Python3 đã cài đặt: $(python3 --version)"

# Tạo virtual environment
echo "📦 Tạo virtual environment..."
if ! python3 -m venv venv 2>/dev/null; then
    echo "⚠️  Không thể tạo virtual environment"
    echo "Cài đặt: sudo apt install python3.10-venv"
    echo ""
    echo "Cài đặt dependencies vào user packages thay thế..."
    python3 -m pip install --user -r requirements.txt
    echo ""
    echo "✅ Đã cài đặt vào user packages"
    echo "Chạy trực tiếp: python3 main.py --scrape-only"
    exit 0
fi

# Kích hoạt venv
echo "🔄 Kích hoạt virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrade pip..."
pip install --upgrade pip

# Cài đặt dependencies
echo "📥 Cài đặt dependencies..."
pip install -r requirements.txt

echo ""
echo "✅ Cài đặt hoàn tất!"
echo ""
echo "Để sử dụng:"
echo "  1. Kích hoạt venv: source venv/bin/activate"
echo "  2. Copy cấu hình: cp .env.example .env"
echo "  3. Chỉnh sửa file .env với thông tin của bạn"
echo "  4. Chạy scraper: python3 main.py --scrape-only"
echo ""
