import requests
from typing import Dict, List
from config import Config


class BackendAPIClient:
    """Client để gửi dữ liệu về backend API"""

    def __init__(self):
        self.config = Config()
        self.base_url = self.config.BACKEND_API_URL
        self.headers = {
            'Authorization': f'Bearer {self.config.API_TOKEN}',
            'Content-Type': 'application/json'
        }

    def create_job(self, job_data: Dict) -> Dict:
        """Tạo job mới thông qua API"""
        endpoint = f"{self.base_url}/jobs"

        # Transform data phù hợp với schema của backend
        payload = {
            'title': job_data.get('position', 'Untitled Position'),
            'description': job_data.get('raw_text', ''),
            'requirements': job_data.get('requirements', []),
            'benefits': job_data.get('benefits', []),
            'location': job_data.get('location', ''),
            'salaryMin': self.parse_salary(job_data.get('salary'), 'min'),
            'salaryMax': self.parse_salary(job_data.get('salary'), 'max'),
            'source': 'facebook_scraper',
            'externalId': str(job_data.get('id', '')),
        }

        try:
            response = requests.post(endpoint, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error creating job: {str(e)}")
            return None

    def parse_salary(self, salary_str: str, type: str) -> float:
        """Parse salary string thành số"""
        if not salary_str:
            return None

        # Extract numbers from salary string
        # Ví dụ: "10-15 triệu" -> min: 10000000, max: 15000000
        import re
        numbers = re.findall(r'\d+', salary_str)

        if not numbers:
            return None

        if type == 'min':
            value = float(numbers[0])
        else:
            value = float(numbers[-1])

        # Nhân với triệu nếu có từ "triệu"
        if 'triệu' in salary_str.lower() or 'million' in salary_str.lower():
            value *= 1000000
        elif 'nghìn' in salary_str.lower() or 'thousand' in salary_str.lower():
            value *= 1000
        
        return value
    
    def batch_create_jobs(self, jobs_data: List[Dict]) -> Dict:
        """Tạo nhiều jobs cùng lúc"""
        results = {
            'success': 0,
            'failed': 0,
            'errors': []
        }
        
        for job_data in jobs_data:
            result = self.create_job(job_data)
            if result:
                results['success'] += 1
                print(f"✓ Created job: {job_data.get('position', 'Unknown')}")
            else:
                results['failed'] += 1
                results['errors'].append(job_data)
                print(f"✗ Failed to create job: {job_data.get('position', 'Unknown')}")
        
        return results
