import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Facebook credentials
    FACEBOOK_EMAIL = os.getenv('FACEBOOK_EMAIL')
    FACEBOOK_PASSWORD = os.getenv('FACEBOOK_PASSWORD')
    GROUP_URL = os.getenv('GROUP_URL')
    
    # Backend API
    BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:3000/api')
    API_TOKEN = os.getenv('API_TOKEN', '')
    
    # Scraping settings
    SCROLL_PAUSE_TIME = int(os.getenv('SCROLL_PAUSE_TIME', 2))
    MAX_POSTS = int(os.getenv('MAX_POSTS', 100))
    HEADLESS = os.getenv('HEADLESS', 'false').lower() == 'true'
    
    # Output
    OUTPUT_DIR = 'output'
    
    # Selectors (có thể thay đổi theo cấu trúc Facebook)
    POST_SELECTOR = 'div[role="article"]'
    POST_TEXT_SELECTOR = 'div[data-ad-comet-preview="message"]'
    POST_AUTHOR_SELECTOR = 'a[role="link"]'
    POST_TIME_SELECTOR = 'a abbr'
