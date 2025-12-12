# Facebook Job Scraper

Tool này dùng Python và Selenium để cào dữ liệu từ Facebook group về các công việc tuyển dụng.

## Cài đặt

```bash
cd scraper

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate

# Cài đặt dependencies
pip install -r requirements.txt
```

Hoặc dùng script tự động:

```bash
chmod +x setup.sh
./setup.sh
```

## Cấu hình

Tạo file `.env` với nội dung:

```
FACEBOOK_EMAIL=your_email@example.com
FACEBOOK_PASSWORD=your_password
GROUP_URL=https://www.facebook.com/groups/your_group_id
```

## Chạy

```bash
# Chỉ cào dữ liệu (lưu vào file)
python3 main.py --scrape-only

# Cào và import vào backend
python3 main.py

# Import từ file có sẵn
python3 main.py --import-file output/jobs_data.json
```

## Lưu ý

- Cần cài đặt Chrome/Firefox driver phù hợp với trình duyệt
- Facebook có thể chặn nếu cào quá nhiều - nên có delay hợp lý
- Tuân thủ Terms of Service của Facebook
- Data sẽ được lưu vào `output/` folder
