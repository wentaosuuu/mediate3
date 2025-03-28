
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';
import { toast } from "sonner";
import { updateUserBasicInfo } from './user-update/useBasicInfoUpdate';
import { departmentAssociationModule } from './user-update/useDepartmentAssociation';
import { roleAssociationModule } from './user-update/useRoleAssociation';
import { Logger } from "@/utils/logger";

// 创建专用日志记录器
const logger = new Logger("UserUpdate");

/**
 * 处理用户更新的钩子
 * 整合各模块功能，协调用户更新流程
 */
export const useUserUpdate = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast: uiToast } = useToast();

  // 更新用户主函数
  const updateUser = async (values: UserFormValues, currentUser: any): Promise<boolean> => {
    logger.info("开始更新用户，表单数据:", values);
    logger.info("当前用户信息:", currentUser);
    
    if (!currentUser || !currentUser.id) {
      logger.error("更新用户失败: 当前用户ID不存在");
      toast.error("更新失败：无法获取用户ID", {
        style: { backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #F87171' }
      });
      return false;
    }
    
    const userId = currentUser.id;
    
    // 防止重复提交
    if (isLoading) {
      logger.info("更新操作正在进行中，忽略重复请求");
      toast.info("操作正在处理中，请稍候...", {
        style: { backgroundColor: '#E0F2FE', color: '#0369A1', border: '1px solid #7DD3FC' }
      });
      return false;
    }
    
    setIsLoading(true);
    
    // 添加唯一的toast ID以便后续更新
    const toastId = `update-user-${Date.now()}`;
    toast.loading("正在更新用户信息...", { id: toastId });
    
    try {
      logger.info("开始用户更新流程，用户ID:", userId);
      
      // 处理特殊值"none"，将其转换为null
      const departmentId = values.department_id === "none" ? null : values.department_id;
      const roleId = values.role_id === "none" ? null : values.role_id;
      
      logger.info(`处理后的部门ID: "${departmentId}", 角色ID: "${roleId}"`);
      
      // 1. 更新用户基本信息
      logger.info("开始更新用户基本信息...");
      await updateUserBasicInfo(userId, values, toastId);
      
      // 2. 处理部门关联
      logger.info("开始处理部门关联...");
      const deptResult = await departmentAssociationModule.handle(userId, departmentId, toastId);
      if (!deptResult.success) {
        logger.warn("部门关联处理未成功，但继续其他更新:", deptResult.error);
        // 记录但继续执行，不中断流程
      }
      
      // 3. 处理角色关联
      logger.info("开始处理角色关联...");
      const roleResult = await roleAssociationModule.handle(userId, roleId, toastId);
      if (!roleResult.success) {
        logger.warn("角色关联处理未成功，但继续其他更新:", roleResult.error);
        // 记录但继续执行，不中断流程
      }
      
      // 显示成功提示 - 使用绿色背景
      toast.success(`用户 ${values.name || values.username} 更新成功`, { 
        id: toastId,
        style: { backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' } 
      });
      
      // 静默刷新用户列表
      await fetchUsers();
      
      logger.info("更新用户流程完成，返回成功状态");
      return true;
    } catch (error) {
      logger.error('更新用户失败:', error);
      toast.error(`更新失败：${(error as Error).message}`, { 
        id: toastId,
        style: { backgroundColor: '#FEE2E2', color: '#B91C1C', border: '1px solid #F87171' } 
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading, 
    updateUser
  };
};
