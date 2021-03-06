/**
 * 定义整个项目的全局配置
 */

module.exports = {
  appName: 'Dental Perfect',
  appId: 'dental-perfect',
  copyRight: {
    title: ' 2018 品清科技体验技术部出品',
    links: '',
  },

  // 图片目录
  imageUrl: 'http://localhost:1338/dental-perfect/files/dental-perfect/',
  // imageUrl: 'http://localhost:1338/parse/files/bee/',
  // imageUrl: 'http://becheer.com:1338/parse/files/bee/',
  // imageUrl: 'https://api.becheer.com.cn/parse/files/bee/',
  imageRootKey: '$ImageRoot$',
  imageRootReg: /\$ImageRoot\$/g,

  // 图片大小限制
  imageLimit: 1 * 1024 * 1024,

  // 业务配置
  categoryPathLimit: 2, // 类目级数限制
  specPathLimit: 2, // 规格级数限制
  groupPathLimit: 2, // 分类级数限制
  goodsImagesLimit: 10, // 商品图片限制

  // 对后端请求的相关配置
  // api: {
  //   host: 'http://localhost:12345',
  //   port: '12345',
  //   path: '/api',
  //   timeout: 15000,
  // },

  // mail: {
  //   host: 'http://localhost:12345',
  //   port: '12345',
  //   path: '/mail',
  //   timeout: 15000,
  // },
};
