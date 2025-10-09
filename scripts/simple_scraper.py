#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用内置库的简单爬虫
"""

import urllib.request
import urllib.parse
import os
import re
import json

def download_modao_images(url):
    """下载墨刀原型图片"""
    
    # 创建输出目录
    output_dir = 'modao_images'
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
        
        # 创建请求
        req = urllib.request.Request(url, headers=headers)
        
        # 发送请求
        with urllib.request.urlopen(req, timeout=10) as response:
            html_content = response.read().decode('utf-8')
        
        print("页面内容获取成功")
        
        # 查找图片URL
        image_patterns = [
            r'https://[^"\']*\.(?:jpg|jpeg|png|gif|webp)',
            r'//[^"\']*\.(?:jpg|jpeg|png|gif|webp)',
        ]
        
        images = []
        for pattern in image_patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            images.extend(matches)
        
        # 去重并过滤
        unique_images = list(set(images))
        modao_images = [img for img in unique_images if 'modao' in img.lower()]
        
        print(f"找到 {len(modao_images)} 张可能的原型图片")
        
        # 保存图片URL列表
        url_file = os.path.join(output_dir, 'image_urls.txt')
        with open(url_file, 'w', encoding='utf-8') as f:
            for img_url in modao_images:
                f.write(img_url + '\n')
        
        # 下载前几张图片作为示例
        downloaded = 0
        for i, img_url in enumerate(modao_images[:5]):  # 只下载前5张
            try:
                # 处理相对URL
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                
                print(f"正在下载第 {i+1} 张图片...")
                
                # 创建图片请求
                img_req = urllib.request.Request(img_url, headers=headers)
                
                with urllib.request.urlopen(img_req, timeout=30) as img_response:
                    img_data = img_response.read()
                
                # 生成文件名
                ext = os.path.splitext(img_url.split('?')[0])[1] or '.jpg'
                filename = os.path.join(output_dir, f"modao_image_{i+1}{ext}")
                
                with open(filename, 'wb') as f:
                    f.write(img_data)
                
                downloaded += 1
                print(f"下载完成: {filename}")
                
            except Exception as e:
                print(f"下载失败: {e}")
                continue
        
        print(f"\n下载完成！共下载 {downloaded} 张图片到 {output_dir} 目录")
        print(f"所有图片URL已保存到: {url_file}")
        
        return True
        
    except Exception as e:
        print(f"访问失败: {e}")
        return False

def main():
    """主函数"""
    print("简单版墨刀原型图爬虫")
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
