// 生成图表数据的工具函数
export const generateChartData = (selectedServices: string[], timeRange: string, department: string, staff: string) => {
  // 基础数据
  const baseData = {
    '短信服务': { name: '短信服务', 使用量: 400 },
    '彩信服务': { name: '彩信服务', 使用量: 300 },
    '外呼服务': { name: '外呼服务', 使用量: 200 },
    'H5系统': { name: 'H5系统', 使用量: 100 },
    '坐席服务': { name: '坐席服务', 使用量: 150 },
    '号码认证': { name: '号码认证', 使用量: 50 },
  };

  if (selectedServices.includes('all')) {
    return Object.values(baseData);
  }

  const serviceTypeMap = {
    'sms': '短信服务',
    'mms': '彩信服务',
    'voice': '外呼服务',
    'h5_system': 'H5系统',
    'seat': '坐席服务',
    'number_auth': '号码认证'
  };

  return selectedServices.map(service => {
    const serviceKey = serviceTypeMap[service as keyof typeof serviceTypeMap] || '';
    return baseData[serviceKey] || { name: serviceKey, 使用量: 0 };
  });
};