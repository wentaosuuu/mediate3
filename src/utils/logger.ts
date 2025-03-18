
/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

/**
 * 应用程序日志配置
 */
interface LoggerConfig {
  // 全局最低日志级别
  minLevel: LogLevel;
  // 是否在生产环境禁用控制台日志
  disableInProduction: boolean;
  // 是否显示时间戳
  showTimestamp: boolean;
  // 是否显示日志级别
  showLogLevel: boolean;
  // 是否显示模块名称
  showModuleName: boolean;
}

/**
 * 默认日志配置
 */
const defaultConfig: LoggerConfig = {
  minLevel: LogLevel.DEBUG,
  disableInProduction: true,
  showTimestamp: true,
  showLogLevel: true,
  showModuleName: true
};

/**
 * 日志记录工具类
 * 用于统一的日志记录，支持不同级别的日志和模块分类
 */
export class Logger {
  private moduleName: string;
  private static config: LoggerConfig = defaultConfig;
  
  /**
   * 构造函数
   * @param moduleName 模块名称，用于标识日志来源
   */
  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }
  
  /**
   * 配置全局日志设置
   * @param config 日志配置
   */
  static configure(config: Partial<LoggerConfig>): void {
    Logger.config = { ...defaultConfig, ...config };
  }
  
  /**
   * 是否应该记录指定级别的日志
   * @param level 日志级别
   */
  private shouldLog(level: LogLevel): boolean {
    // 在生产环境且配置为禁用时不记录日志
    if (process.env.NODE_ENV === 'production' && Logger.config.disableInProduction) {
      return false;
    }
    
    // 根据最低日志级别判断
    return level >= Logger.config.minLevel;
  }
  
  /**
   * 格式化日志消息
   * @param level 日志级别
   * @param message 消息内容
   */
  private formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];
    
    // 添加时间戳
    if (Logger.config.showTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    // 添加日志级别
    if (Logger.config.showLogLevel) {
      const levelStr = LogLevel[level].padEnd(5);
      parts.push(`[${levelStr}]`);
    }
    
    // 添加模块名
    if (Logger.config.showModuleName && this.moduleName) {
      parts.push(`[${this.moduleName}]`);
    }
    
    // 添加消息内容
    parts.push(message);
    
    return parts.join(' ');
  }
  
  /**
   * 记录调试级别日志
   * @param message 消息内容
   * @param args 附加参数
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message), ...args);
    }
  }
  
  /**
   * 记录信息级别日志
   * @param message 消息内容
   * @param args 附加参数
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message), ...args);
    }
  }
  
  /**
   * 记录警告级别日志
   * @param message 消息内容
   * @param args 附加参数
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message), ...args);
    }
  }
  
  /**
   * 记录错误级别日志
   * @param message 消息内容
   * @param args 附加参数
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message), ...args);
    }
  }
  
  /**
   * 记录时间性能
   * @param label 标签
   * @param callback 要测量的回调函数
   * @returns 回调函数的返回值
   */
  async time<T>(label: string, callback: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      return await callback();
    } finally {
      const duration = performance.now() - start;
      this.info(`${label} 完成, 耗时 ${duration.toFixed(2)}ms`);
    }
  }
}
