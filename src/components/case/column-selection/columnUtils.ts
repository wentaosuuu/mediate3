
/**
 * 定义列信息和标题的映射
 */
export const columnTitles: Record<string, string> = {
  caseNumber: '案件编号',
  batchNumber: '批次编号',
  borrowerNumber: '借据编号',
  idNumber: '身份证号',
  customerName: '客户姓名',
  phone: '手机号',
  productLine: '产品线',
  receiver: '受托方',
  adjuster: '调解员',
  distributor: '分案员',
  progressStatus: '跟进状态',
  latestProgressTime: '最新跟进时间',
  latestEditTime: '最新编辑时间',
  caseEntryTime: '案件入库时间',
  distributionTime: '分案时间',
  resultTime: '结案时间',
  actions: '操作'
};

/**
 * 获取所有可配置的列 (不包含操作列)
 */
export const getConfigurableColumns = () => {
  return Object.keys(columnTitles).filter(col => col !== 'actions');
};
