/**
 * 生成订单号
 * 格式: R + 年月日时分秒 + 4位随机数
 */
export const generateOrderNumber = () => {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[-:]/g, '')  // 移除日期中的破折号和冒号
    .replace(/T/g, '')     // 移除T
    .replace(/\..+/, '');  // 移除毫秒部分
  
  // 生成4位随机数
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `R${timestamp}${random}`;
};