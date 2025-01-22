// 获取时间单位名称
export const getTimeUnitName = (unit: string) => {
  const unitMap: Record<string, string> = {
    'day': '天',
    'week': '周',
    'month': '月',
    'custom': '自定义',
  };
  return unitMap[unit] || unit;
};

// 格式化日期
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 获取服务类型名称
export const getServiceTypeName = (type?: string) => {
  const serviceMap: Record<string, string> = {
    'all': '全部服务',
    'sms': '短信服务',
    'voice': '语音服务',
    'h5': 'H5案件公示',
  };
  return type ? (serviceMap[type] || type) : '-';
};