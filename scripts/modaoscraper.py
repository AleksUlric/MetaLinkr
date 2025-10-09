#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
墨刀原型图爬虫程序
用于获取墨刀平台上的原型设计图片

注意：请确保遵守墨刀平台的使用条款和版权规定
"""

import requests
import os
import json
import time
from urllib.parse import urlparse, parse_qs
from bs4 import BeautifulSoup
import re

class ModaoScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
    def extract_project_id(self, url):
        """从URL中提取项目ID"""
        try:
            # 从URL中提取项目ID
            match = re.search(r'/details/([a-zA-Z0-9]+)', url)
            if match:
                return match.group(1)
            return None
        except Exception as e:
            print(f"提取项目ID失败: {e}")
            return None
    
    def get_project_info(self, url):
        """获取项目基本信息"""
        try:
            print(f"正在访问: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 提取项目信息
            project_info = {
                'title': '',
                'description': '',
                'author': '',
                'images': []
            }
            
            # 提取标题
            title_elem = soup.find('h1') or soup.find('title')
            if title_elem:
                project_info['title'] = title_elem.get_text().strip()
            
            # 提取描述
            desc_elem = soup.find('meta', {'name': 'description'})
            if desc_elem:
                project_info['description'] = desc_elem.get('content', '').strip()
            
            # 查找图片
            images = soup.find_all('img')
            for img in images:
                src = img.get('src') or img.get('data-src')
                if src:
                    # 处理相对URL
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        src = 'https://modao.cc' + src
                    
                    project_info['images'].append(src)
            
            return project_info
            
        except Exception as e:
            print(f"获取项目信息失败: {e}")
            return None
    
    def download_image(self, url, filename):
        """下载图片"""
        try:
            print(f"正在下载: {filename}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            with open(filename, 'wb') as f:
                f.write(response.content)
            
            print(f"下载完成: {filename}")
            return True
            
        except Exception as e:
            print(f"下载失败 {filename}: {e}")
            return False
    
    def scrape_project(self, url, output_dir='modao_images'):
        """爬取整个项目"""
        # 创建输出目录
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        # 提取项目ID
        project_id = self.extract_project_id(url)
        if not project_id:
            print("无法提取项目ID")
            return False
        
        print(f"项目ID: {project_id}")
        
        # 获取项目信息
        project_info = self.get_project_info(url)
        if not project_info:
            print("无法获取项目信息")
            return False
        
        print(f"项目标题: {project_info['title']}")
        print(f"找到 {len(project_info['images'])} 张图片")
        
        # 保存项目信息
        info_file = os.path.join(output_dir, f"{project_id}_info.json")
        with open(info_file, 'w', encoding='utf-8') as f:
            json.dump(project_info, f, ensure_ascii=False, indent=2)
        
        # 下载图片
        downloaded_count = 0
        for i, img_url in enumerate(project_info['images']):
            if img_url and ('modao' in img_url or 'prototype' in img_url.lower()):
                # 生成文件名
                ext = os.path.splitext(img_url.split('?')[0])[1] or '.jpg'
                filename = os.path.join(output_dir, f"{project_id}_image_{i+1}{ext}")
                
                if self.download_image(img_url, filename):
                    downloaded_count += 1
                
                # 添加延迟避免被封
                time.sleep(1)
        
        print(f"下载完成，共下载 {downloaded_count} 张图片")
        return True

def main():
    """主函数"""
    print("墨刀原型图爬虫程序")
    print("=" * 50)
    
    # 目标URL
    url = input("请输入墨刀原型链接: ").strip()
    if not url:
        # 使用默认URL
        url = "https://modao.cc/com24/details/mtlu2ggecfl4yhi?category=project_basic&plabel=%E7%A4%BE%E4%BA%A4&order=recommend&platform=app"
        print(f"使用默认URL: {url}")
    
    # 创建爬虫实例
    scraper = ModaoScraper()
    
    # 开始爬取
    try:
        success = scraper.scrape_project(url)
        if success:
            print("\n爬取完成！")
        else:
            print("\n爬取失败！")
    except KeyboardInterrupt:
        print("\n用户中断操作")
    except Exception as e:
        print(f"\n程序异常: {e}")

if __name__ == "__main__":
    main()
