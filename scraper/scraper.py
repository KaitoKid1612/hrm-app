from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import json
import re
from typing import List, Dict
from config import Config


class FacebookGroupScraper:
    def __init__(self):
        self.config = Config()
        self.driver = None
        self.posts_data = []

    def setup_driver(self):
        """Khởi tạo Chrome driver với các options cần thiết"""
        chrome_options = Options()

        if self.config.HEADLESS:
            chrome_options.add_argument('--headless')

        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        self.driver.maximize_window()

    def login_facebook(self):
        """Đăng nhập vào Facebook"""
        print("Đang đăng nhập Facebook...")
        self.driver.get('https://www.facebook.com')

        try:
            # Tìm và điền email
            email_field = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, 'email'))
            )
            email_field.send_keys(self.config.FACEBOOK_EMAIL)

            # Tìm và điền password
            password_field = self.driver.find_element(By.ID, 'pass')
            password_field.send_keys(self.config.FACEBOOK_PASSWORD)

            # Click nút đăng nhập
            login_button = self.driver.find_element(By.NAME, 'login')
            login_button.click()

            # Đợi đăng nhập thành công
            time.sleep(5)
            print("Đăng nhập thành công!")

        except Exception as e:
            print(f"Lỗi khi đăng nhập: {str(e)}")
            raise

    def navigate_to_group(self):
        """Điều hướng đến group"""
        print(f"Đang truy cập group: {self.config.GROUP_URL}")
        self.driver.get(self.config.GROUP_URL)
        time.sleep(3)

    def scroll_and_load_posts(self):
        """Scroll xuống để load thêm bài viết"""
        print("Đang load bài viết...")

        last_height = self.driver.execute_script("return document.body.scrollHeight")
        posts_loaded = 0

        while posts_loaded < self.config.MAX_POSTS:
            # Scroll xuống
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(self.config.SCROLL_PAUSE_TIME)

            # Tính chiều cao mới
            new_height = self.driver.execute_script("return document.body.scrollHeight")

            # Đếm số bài viết hiện tại
            posts = self.driver.find_elements(By.CSS_SELECTOR, self.config.POST_SELECTOR)
            posts_loaded = len(posts)
            print(f"Đã load {posts_loaded} bài viết...")

            # Nếu đã đến cuối trang
            if new_height == last_height:
                print("Đã đến cuối trang")
                break

            last_height = new_height

    def extract_job_info(self, post_text: str) -> Dict:
        """Trích xuất thông tin công việc từ text"""
        job_info = {
            'position': None,
            'company': None,
            'location': None,
            'salary': None,
            'requirements': [],
            'benefits': [],
            'raw_text': post_text
        }

        # Regex patterns để tìm thông tin (có thể tùy chỉnh)
        patterns = {
            'position': r'(?:vị trí|position|tuyển dụng)[\s:]+([^\n]+)',
            'company': r'(?:công ty|company)[\s:]+([^\n]+)',
            'location': r'(?:địa điểm|location|nơi làm việc)[\s:]+([^\n]+)',
            'salary': r'(?:lương|salary|mức lương)[\s:]+([^\n]+)',
        }

        for key, pattern in patterns.items():
            match = re.search(pattern, post_text, re.IGNORECASE)
            if match:
                job_info[key] = match.group(1).strip()

        return job_info

    def parse_posts(self):
        """Parse các bài viết đã load"""
        print("Đang parse dữ liệu...")

        posts = self.driver.find_elements(By.CSS_SELECTOR, self.config.POST_SELECTOR)
        
        for idx, post in enumerate(posts[:self.config.MAX_POSTS], 1):
            try:
                # Lấy HTML của post
                post_html = post.get_attribute('innerHTML')
                soup = BeautifulSoup(post_html, 'html.parser')
                
                # Lấy text của bài viết
                post_text_elem = post.find_elements(By.CSS_SELECTOR, self.config.POST_TEXT_SELECTOR)
                post_text = post_text_elem[0].text if post_text_elem else ""
                
                # Lấy tác giả
                author_elem = post.find_elements(By.CSS_SELECTOR, self.config.POST_AUTHOR_SELECTOR)
                author = author_elem[0].text if author_elem else "Unknown"
                
                # Lấy thời gian
                time_elem = post.find_elements(By.CSS_SELECTOR, self.config.POST_TIME_SELECTOR)
                post_time = time_elem[0].get_attribute('textContent') if time_elem else ""
                
                # Trích xuất thông tin job
                job_info = self.extract_job_info(post_text)
                
                post_data = {
                    'id': idx,
                    'author': author,
                    'time': post_time,
                    'text': post_text,
                    'job_info': job_info
                }
                
                self.posts_data.append(post_data)
                print(f"Đã parse {idx}/{len(posts)} bài viết")
                
            except Exception as e:
                print(f"Lỗi khi parse bài viết {idx}: {str(e)}")
                continue
    
    def save_to_json(self, filename='jobs_data.json'):
        """Lưu dữ liệu vào file JSON"""
        import os
        
        os.makedirs(self.config.OUTPUT_DIR, exist_ok=True)
        filepath = os.path.join(self.config.OUTPUT_DIR, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.posts_data, f, ensure_ascii=False, indent=2)
        
        print(f"Đã lưu {len(self.posts_data)} bài viết vào {filepath}")
    
    def save_to_csv(self, filename='jobs_data.csv'):
        """Lưu dữ liệu vào file CSV"""
        import pandas as pd
        import os
        
        os.makedirs(self.config.OUTPUT_DIR, exist_ok=True)
        filepath = os.path.join(self.config.OUTPUT_DIR, filename)
        
        # Flatten dữ liệu cho CSV
        flat_data = []
        for post in self.posts_data:
            flat_post = {
                'id': post['id'],
                'author': post['author'],
                'time': post['time'],
                'text': post['text'],
                'position': post['job_info']['position'],
                'company': post['job_info']['company'],
                'location': post['job_info']['location'],
                'salary': post['job_info']['salary'],
            }
            flat_data.append(flat_post)
        
        df = pd.DataFrame(flat_data)
        df.to_csv(filepath, index=False, encoding='utf-8-sig')
        
        print(f"Đã lưu {len(flat_data)} bài viết vào {filepath}")
    
    def close(self):
        """Đóng browser"""
        if self.driver:
            self.driver.quit()
            print("Đã đóng browser")
    
    def run(self):
        """Chạy toàn bộ quy trình scraping"""
        try:
            self.setup_driver()
            self.login_facebook()
            self.navigate_to_group()
            self.scroll_and_load_posts()
            self.parse_posts()
            self.save_to_json()
            self.save_to_csv()
            
        except Exception as e:
            print(f"Lỗi: {str(e)}")
            raise
        finally:
            self.close()
