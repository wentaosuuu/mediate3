
import { Logger, LogLevel } from '../logger';

// 模拟 console 方法
const originalConsole = { ...console };
let consoleDebugSpy: jest.SpyInstance;
let consoleInfoSpy: jest.SpyInstance;
let consoleWarnSpy: jest.SpyInstance;
let consoleErrorSpy: jest.SpyInstance;

describe('Logger', () => {
  beforeEach(() => {
    // 设置 console 方法的 spy
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // 重置 Logger 配置
    Logger.configure({
      minLevel: LogLevel.DEBUG,
      disableInProduction: true,
      showTimestamp: true,
      showLogLevel: true,
      showModuleName: true
    });
    
    // 保存 process.env.NODE_ENV 的原始值
    process.env.NODE_ENV = 'development';
  });
  
  afterEach(() => {
    // 恢复 console 方法
    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
  
  it('应该使用正确的模块名创建 Logger 实例', () => {
    const moduleName = 'TestModule';
    const logger = new Logger(moduleName);
    
    logger.info('测试消息');
    
    expect(consoleInfoSpy).toHaveBeenCalled();
    const logMessage = consoleInfoSpy.mock.calls[0][0];
    expect(logMessage).toContain(`[${moduleName}]`);
  });
  
  it('应该根据配置的最低日志级别过滤日志', () => {
    // 设置最低日志级别为 WARN
    Logger.configure({ minLevel: LogLevel.WARN });
    
    const logger = new Logger('TestModule');
    
    // DEBUG 和 INFO 级别不应输出
    logger.debug('调试消息');
    logger.info('信息消息');
    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
    
    // WARN 和 ERROR 级别应输出
    logger.warn('警告消息');
    logger.error('错误消息');
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
  
  it('在生产环境中应根据配置禁用日志', () => {
    // 模拟生产环境
    process.env.NODE_ENV = 'production';
    
    const logger = new Logger('TestModule');
    
    // 默认在生产环境中禁用日志
    logger.debug('调试消息');
    logger.info('信息消息');
    logger.warn('警告消息');
    logger.error('错误消息');
    
    expect(consoleDebugSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    
    // 配置在生产环境中启用日志
    Logger.configure({ disableInProduction: false });
    
    logger.error('生产环境错误');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
  
  it('应根据配置格式化日志消息', () => {
    // 测试完整配置
    const logger = new Logger('TestModule');
    logger.info('测试消息');
    
    let logMessage = consoleInfoSpy.mock.calls[0][0];
    // 包含时间戳、日志级别和模块名
    expect(logMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    expect(logMessage).toContain('[INFO ]');
    expect(logMessage).toContain('[TestModule]');
    
    // 测试禁用部分格式
    Logger.configure({ 
      showTimestamp: false, 
      showLogLevel: false
    });
    
    logger.info('简化消息');
    logMessage = consoleInfoSpy.mock.calls[1][0];
    
    // 不应包含时间戳和日志级别
    expect(logMessage).not.toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    expect(logMessage).not.toContain('[INFO ]');
    // 仍应包含模块名
    expect(logMessage).toContain('[TestModule]');
  });
  
  it('应该正确测量和记录函数执行时间', async () => {
    const logger = new Logger('PerformanceTest');
    
    // 模拟一个异步函数
    const mockFunction = jest.fn().mockImplementation(async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve('结果'), 10);
      });
    });
    
    const result = await logger.time('测试函数', async () => {
      return await mockFunction();
    });
    
    expect(mockFunction).toHaveBeenCalled();
    expect(result).toBe('结果');
    expect(consoleInfoSpy).toHaveBeenCalled();
    expect(consoleInfoSpy.mock.calls[0][0]).toMatch(/测试函数 完成, 耗时 \d+\.\d+ms/);
  });
});
