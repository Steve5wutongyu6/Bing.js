// 替换为您的 OSS 地址
const ossBaseUrl = 'https://example.oss-cn-hongkong.aliyuncs.com/bingwallpaper/';

// 获取 URL 参数
const urlParams = new URLSearchParams(window.location.search);
const dateParam = urlParams.get('date');

// 获取当前日期
const currentDate = dateParam ? new Date(dateParam) : new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0');
const day = String(currentDate.getDate()).padStart(2, '0');

// 构建图片 URL
const imageUrl = ossBaseUrl + year + month + day + '.jpg';

// 创建图片元素
const imageElement = document.createElement('img');
imageElement.src = imageUrl;

// 添加图片到容器
const wallpaperContainer = document.getElementById('wallpaperContainer');
wallpaperContainer.appendChild(imageElement);
