#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
最终版墨刀爬虫 - 处理编码问题
"""

import urllib.request
import urllib.parse
import os
import re
import json

def safe_get_content(url):
    """安全获取页面内容"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            # 读取原始字节
            raw_data = response.read()
            
            # 尝试多种编码
            encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1']
            for encoding in encodings:
                try:
                    content = raw_data.decode(encoding)
                    print(f"成功使用 {encoding} 编码解码")
                    return content
                except UnicodeDecodeError:
                    continue
            
            # 如果都失败，使用错误处理
            content = raw_data.decode('utf-8', errors='ignore')
            print("使用错误处理模式解码")
            return content
            
    except Exception as e:
        print(f"获取页面失败: {e}")
        return None

def find_all_images(content):
    """查找所有图片URL"""
    images = []
    
    # 更全面的图片URL模式
    patterns = [
        # 标准图片URL
        r'https?://[^"\'>\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp)',
        # 相对路径
        r'/[^"\'>\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp)',
        # 双斜杠
        r'//[^"\'>\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp)',
        # 引号内的URL
        r'["\']([^"\']*\.(?:jpg|jpeg|png|gif|webp|svg|bmp))["\']',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        images.extend(matches)
    
    # 去重
    unique_images = list(set(images))
    
    # 清理和过滤
    cleaned_images = []
    for img in unique_images:
        img = img.strip()
        if not img:
            continue
        
        # 处理相对URL
        if img.startswith('//'):
            img = 'https:' + img
        elif img.startswith('/') and not img.startswith('//'):
            img = 'https://modao.cc' + img
        
        # 过滤掉明显不是原型图的
        skip_keywords = ['logo', 'icon', 'avatar', 'profile', 'favicon', 'banner']
        if any(keyword in img.lower() for keyword in skip_keywords):
            continue
        
        cleaned_images.append(img)
    
    return cleaned_images

def download_safe(url, filename):
    """安全下载图片"""
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
        print(f"下载失败: {e}")
        return False

def main():
    """主函数"""
    print("最终版墨刀爬虫")
    print("=" * 40)
    
    url = "https://modao.cc/com24/details/mtlu2ggecfl4yhi?category=project_basic&plabel=%E7%A4%BE%E4%BA%A4&order=recommend&platform=app"
    
    print(f"目标URL: {url}")
    print("开始爬取...")
    
    # 获取页面内容
    content = safe_get_content(url)
    if not content:
        print("无法获取页面内容")
        return
    
    print("页面内容获取成功")
    
    # 查找图片
    images = find_all_images(content)
    print(f"找到 {len(images)} 张图片")
    
    # 创建输出目录
    output_dir = 'modao_images'
    os.makedirs(output_dir, exist_ok=True)
    
    # 保存所有URL
    url_file = os.path.join(output_dir, 'found_urls.txt')
    with open(url_file, 'w', encoding='utf-8') as f:
        for img_url in images:
            f.write(img_url + '\n')
    
    print(f"所有URL已保存到: {url_file}")
    
    # 尝试下载前几张图片
    downloaded = 0
    for i, img_url in enumerate(images[:5]):
        try:
            print(f"正在下载第 {i+1} 张...")
            
            # 生成文件名
            filename = f"image_{i+1}.jpg"
            filepath = os.path.join(output_dir, filename)
            
            if download_safe(img_url, filepath):
                downloaded += 1
                print(f"下载成功: {filename}")
            
        except Exception as e:
            print(f"处理失败: {e}")
            continue
    
    print(f"\n下载完成！共下载 {downloaded} 张图片")
    print("请查看 modao_images 目录")

if __name__ == "__main__":
    main()
