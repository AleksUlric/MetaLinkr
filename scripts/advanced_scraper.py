#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
高级墨刀爬虫 - 使用多种方法获取原型图
"""

import urllib.request
import urllib.parse
import os
import re
import json
import time

def get_page_content(url):
    """获取页面内容"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            content = response.read()
            
            # 尝试解码
            try:
                return content.decode('utf-8')
            except UnicodeDecodeError:
                return content.decode('gbk')
                
    except Exception as e:
        print(f"获取页面内容失败: {e}")
        return None

def extract_images_from_content(content):
    """从页面内容中提取图片URL"""
    images = []
    
    # 多种图片URL模式
    patterns = [
        # 完整的HTTP/HTTPS图片URL
        r'https?://[^"\'>\s]+\.(?:jpg|jpeg|png|gif|webp|svg)',
        # 相对路径图片
        r'/[^"\'>\s]+\.(?:jpg|jpeg|png|gif|webp|svg)',
        # 双斜杠图片
        r'//[^"\'>\s]+\.(?:jpg|jpeg|png|gif|webp|svg)',
        # data-src属性
        r'data-src=["\']([^"\']+\.(?:jpg|jpeg|png|gif|webp|svg))["\']',
        # srcset属性
        r'srcset=["\']([^"\']+\.(?:jpg|jpeg|png|gif|webp|svg))["\']',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        images.extend(matches)
    
    # 去重
    unique_images = list(set(images))
    
    # 过滤和清理
    filtered_images = []
    for img in unique_images:
        # 清理URL
        img = img.strip()
        if not img:
            continue
            
        # 处理相对URL
        if img.startswith('//'):
            img = 'https:' + img
        elif img.startswith('/') and not img.startswith('//'):
            img = 'https://modao.cc' + img
        
        # 过滤掉明显不是原型图的图片
        if any(keyword in img.lower() for keyword in ['logo', 'icon', 'avatar', 'profile']):
            continue
            
        filtered_images.append(img)
    
    return filtered_images

def download_image(url, filename):
    """下载单张图片"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://modao.cc/',
        }
        
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()
        
        with open(filename, 'wb') as f:
            f.write(data)
        
        return True
    except Exception as e:
        print(f"下载失败 {url}: {e}")
        return False

def scrape_modao_prototype(url):
    """爬取墨刀原型"""
    print(f"开始爬取: {url}")
    
    # 创建输出目录
    output_dir = 'modao_images'
    os.makedirs(output_dir, exist_ok=True)
    
    # 获取页面内容
    content = get_page_content(url)
    if not content:
        print("无法获取页面内容")
        return False
    
    print("页面内容获取成功")
    
    # 提取图片URL
    images = extract_images_from_content(content)
    print(f"找到 {len(images)} 张图片")
    
    # 保存图片URL列表
    url_file = os.path.join(output_dir, 'all_urls.txt')
    with open(url_file, 'w', encoding='utf-8') as f:
        for img_url in images:
            f.write(img_url + '\n')
    
    # 尝试下载图片
    downloaded = 0
    for i, img_url in enumerate(images[:10]):  # 只下载前10张
        try:
            print(f"正在下载第 {i+1} 张: {img_url}")
            
            # 生成文件名
            parsed_url = urllib.parse.urlparse(img_url)
            filename = os.path.basename(parsed_url.path)
            if not filename or '.' not in filename:
                filename = f"image_{i+1}.jpg"
            
            filepath = os.path.join(output_dir, filename)
            
            if download_image(img_url, filepath):
                downloaded += 1
                print(f"下载成功: {filename}")
            
            time.sleep(1)  # 添加延迟
            
        except Exception as e:
            print(f"处理图片失败: {e}")
            continue
    
    print(f"\n下载完成！共下载 {downloaded} 张图片")
    print(f"所有URL已保存到: {url_file}")
    
    return True

def main():
    """主函数"""
    print("高级墨刀原型爬虫")
    print("=" * 50)
    
    # 目标URL
    url = "https://modao.cc/com24/details/mtlu2ggecfl4yhi?category=project_basic&plabel=%E7%A4%BE%E4%BA%A4&order=recommend&platform=app"
    
    print(f"目标URL: {url}")
    
    success = scrape_modao_prototype(url)
    
    if success:
        print("\n爬取完成！")
        print("请查看 modao_images 目录")
    else:
        print("\n爬取失败！")

if __name__ == "__main__":
    main()
