#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化版墨刀原型图爬虫
专门用于获取墨刀原型设计图片
"""

import requests
import os
import json
import time
from urllib.parse import urljoin

def download_modao_images(url, output_dir='modao_images'):
    """下载墨刀原型图片"""
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 设置请求头
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': 'https://modao.cc/',
    }
    
    try:
        print(f"正在访问: {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # 查找页面中的图片链接
        import re
        
        # 查找常见的图片URL模式
        image_patterns = [
            r'https://[^"\']*\.(?:jpg|jpeg|png|gif|webp)',
            r'//[^"\']*\.(?:jpg|jpeg|png|gif|webp)',
            r'/[^"\']*\.(?:jpg|jpeg|png|gif|webp)',
        ]
        
        images = []
        for pattern in image_patterns:
            matches = re.findall(pattern, response.text, re.IGNORECASE)
            images.extend(matches)
        
        # 去重并过滤
        unique_images = list(set(images))
        modao_images = [img for img in unique_images if 'modao' in img.lower() or 'prototype' in img.lower()]
        
        print(f"找到 {len(modao_images)} 张可能的原型图片")
        
        # 下载图片
        downloaded = 0
        for i, img_url in enumerate(modao_images):
            try:
                # 处理相对URL
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                elif img_url.startswith('/'):
                    img_url = 'https://modao.cc' + img_url
                
                print(f"正在下载第 {i+1} 张图片...")
                
                img_response = requests.get(img_url, headers=headers, timeout=30)
                img_response.raise_for_status()
                
                # 生成文件名
                ext = os.path.splitext(img_url.split('?')[0])[1] or '.jpg'
                filename = os.path.join(output_dir, f"modao_image_{i+1}{ext}")
                
                with open(filename, 'wb') as f:
                    f.write(img_response.content)
                
                downloaded += 1
                print(f"下载完成: {filename}")
                
                # 添加延迟
                time.sleep(1)
                
            except Exception as e:
                print(f"下载失败: {e}")
                continue
        
        print(f"\n下载完成！共下载 {downloaded} 张图片到 {output_dir} 目录")
        
        # 保存图片URL列表
        url_file = os.path.join(output_dir, 'image_urls.txt')
        with open(url_file, 'w', encoding='utf-8') as f:
            for img_url in modao_images:
                f.write(img_url + '\n')
        
        return True
        
    except Exception as e:
        print(f"访问失败: {e}")
        return False

def main():
    """主函数"""
    print("简化版墨刀原型图爬虫")
    print("=" * 40)
    
    # 目标URL
    url = "https://modao.cc/com24/details/mtlu2ggecfl4yhi?category=project_basic&plabel=%E7%A4%BE%E4%BA%A4&order=recommend&platform=app"
    
    print(f"目标URL: {url}")
    print("开始爬取...")
    
    success = download_modao_images(url)
    
    if success:
        print("\n✅ 爬取完成！")
        print("请查看 modao_images 目录中的图片")
    else:
        print("\n❌ 爬取失败！")

if __name__ == "__main__":
    main()
