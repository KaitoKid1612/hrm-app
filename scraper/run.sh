#!/bin/bash

# Script helper để chạy scraper

# Kích hoạt virtual environment nếu có
if [ -d "venv" ]; then
    echo "🔄 Sử dụng virtual environment..."
    source venv/bin/activate
else
    echo "ℹ️  Chạy với Python system/user packages"
fi

# Kiểm tra .env
if [ ! -f ".env" ]; then
    echo "⚠️  File .env chưa tồn tại"
    echo "Tạo từ template: cp .env.example .env"
    echo "Sau đó chỉnh sửa với thông tin của bạn"
    exit 1
fi

# Chạy scraper với arguments
python3 main.py "$@"
