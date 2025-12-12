#!/usr/bin/env python3
"""
Facebook Group Job Scraper
Cào dữ liệu công việc từ Facebook group và import vào hệ thống
"""

import argparse
import json
import sys
from scraper import FacebookGroupScraper
from api_client import BackendAPIClient


def main():
    parser = argparse.ArgumentParser(description='Scrape job posts from Facebook group')
    parser.add_argument('--scrape-only', action='store_true', 
                       help='Only scrape data without sending to backend')
    parser.add_argument('--import-file', type=str,
                       help='Import data from JSON file to backend')

    args = parser.parse_args()

    if args.import_file:
        # Import từ file có sẵn
        print(f"Đang import dữ liệu từ {args.import_file}...")
        import_from_file(args.import_file)
    else:
        # Scrape dữ liệu mới
        scraper = FacebookGroupScraper()
        scraper.run()

        if not args.scrape_only:
            # Gửi dữ liệu về backend
            print("\nĐang gửi dữ liệu về backend...")
            send_to_backend(scraper.posts_data)


def import_from_file(filepath: str):
    """Import dữ liệu từ file JSON"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Extract job_info từ mỗi post
        jobs_data = [post['job_info'] for post in data if 'job_info' in post]

        send_to_backend(jobs_data)

    except FileNotFoundError:
        print(f"Không tìm thấy file: {filepath}")
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"File JSON không hợp lệ: {filepath}")
        sys.exit(1)


def send_to_backend(posts_data):
    """Gửi dữ liệu về backend API"""
    api_client = BackendAPIClient()

    # Extract job info từ posts
    jobs_data = []
    for post in posts_data:
        if isinstance(post, dict) and 'job_info' in post:
            jobs_data.append(post['job_info'])
        elif isinstance(post, dict):
            jobs_data.append(post)

    results = api_client.batch_create_jobs(jobs_data)

    print("\n" + "="*50)
    print("KẾT QUẢ IMPORT")
    print("="*50)
    print(f"✓ Thành công: {results['success']}")
    print(f"✗ Thất bại: {results['failed']}")

    if results['errors']:
        print("\nCác bài viết lỗi:")
        for error in results['errors'][:5]:  # Show first 5 errors
            print(f"  - {error.get('position', 'Unknown')}")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nĐã dừng chương trình")
        sys.exit(0)
    except Exception as e:
        print(f"\nLỗi: {str(e)}")
        sys.exit(1)
