const axios = require('axios');
const fs = require('fs');
const OSS = require('ali-oss');
const moment = require('moment');

// 阿里云 OSS 配置
const ossConfig = {
  region: process.env.region,
  accessKeyId: process.env.accesskeyid,
  accessKeySecret: process.env.accesskeysecret,
  bucket: process.env.bucket,
  folder: process.env.folder // 存储壁纸的文件夹名称
};

// Bing API 配置
const bingApiUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN';

async function downloadBingWallpaper() {
  try {
    const currentDate = moment().utcOffset('+08:00'); // 获取当前北京时间
    const formattedDate = currentDate.format('YYYYMMDD'); // 格式化日期

    // 删除前一天的壁纸
    const previousDate = currentDate.subtract(1, 'day').format('YYYYMMDD');
    const previousImageFileName = previousDate + '.jpg';
    deleteLocalWallpaper(previousImageFileName);

    const apiUrl = `${bingApiUrl}&date=${formattedDate}`;
    const response = await axios.get(apiUrl);
    const imageUrl = `https://www.bing.com${response.data.images[0].url}`;
    const imageFileName = formattedDate + '.jpg';

    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
    const imagePath = `./${imageFileName}`;

    const writer = fs.createWriteStream(imagePath);
    imageResponse.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(imagePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function deleteLocalWallpaper(imageFileName) {
  try {
    fs.unlinkSync(`./${imageFileName}`);
    console.log('Previous wallpaper deleted:', imageFileName);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function uploadToOSS(imagePath) {
  try {
    const ossClient = new OSS({
      region: ossConfig.region,
      accessKeyId: ossConfig.accessKeyId,
      accessKeySecret: ossConfig.accessKeySecret,
      bucket: ossConfig.bucket
    });

    const ossFilePath = `${ossConfig.folder}/${imagePath.substring(2)}`;
    await ossClient.put(ossFilePath, imagePath);

    console.log('Bing wallpaper uploaded to OSS:', ossFilePath);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error occurred during upload:', error);
  }
}

const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
console.log('Script started at:', currentTime);

downloadBingWallpaper()
  .then((imagePath) => {
    console.log('Bing wallpaper saved:', imagePath);
    uploadToOSS(imagePath);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
