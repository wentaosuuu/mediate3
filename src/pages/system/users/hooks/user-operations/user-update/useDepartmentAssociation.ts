
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Logger } from "@/utils/logger";

// 创建一个专门的日志记录器
const logger = new Logger("DepartmentAssociationModule");

/**
 * 用户-部门关联处理模块
 * 负责处理用户与部门之间的关联关系
 */
export const departmentAssociationModule = {
  /**
   * 处理用户与部门的关联（创建或更新）
   * @param userId 用户ID
   * @param departmentId 部门ID，如果为null或空字符串，则表示无部门
   * @param toastId 可选的toast通知ID，用于更新现有通知
   * @returns 操作结果对象，包含是否成功和可能的错误信息
   */
  async handle(userId: string, departmentId: string | null, toastId?: string): Promise<{success: boolean; error?: Error}> {
    logger.info(`处理用户(${userId})的部门关联，部门ID: ${departmentId || '无'}`);
    
    if (!userId) {
      const error = new Error("用户ID不能为空");
      logger.error("处理用户-部门关联失败:", error);
      toast.error("关联失败：用户ID不能为空", { id: toastId });
      return { success: false, error };
    }
    
    try {
      // 检查用户是否有现有部门关联
      const { data: existingDept, error: checkError } = await supabase
        .from('user_departments')
        .select('id, department_id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        logger.error("检查部门关联状态失败:", checkError);
        toast.error(`检查部门关联状态失败: ${checkError.message}`, { id: toastId });
        return { success: false, error: checkError };
      }
      
      // 处理部门关联
      if (departmentId) {
        // 有部门ID，需要创建或更新关联
        if (existingDept) {
          // 有现有关联，执行更新
          logger.info(`更新部门关联，用户ID: ${userId}, 部门ID: ${departmentId}, 现有关联ID: ${existingDept.id}`);
          const { error: updateError } = await supabase
            .from('user_departments')
            .update({ department_id: departmentId })
            .eq('id', existingDept.id)
            .eq('user_id', userId);
            
          if (updateError) {
            logger.error("更新部门关联失败:", updateError);
            toast.error(`更新部门关联失败: ${updateError.message}`, { id: toastId });
            return { success: false, error: updateError };
          }
          logger.info("部门关联已更新");
        } else {
          // 无现有关联，创建新关联
          logger.info(`创建部门关联，用户ID: ${userId}, 部门ID: ${departmentId}`);
          const { error: insertError } = await supabase
            .from('user_departments')
            .insert({ user_id: userId, department_id: departmentId });
            
          if (insertError) {
            logger.error("创建部门关联失败:", insertError);
            toast.error(`创建部门关联失败: ${insertError.message}`, { id: toastId });
            return { success: false, error: insertError };
          }
          logger.info("部门关联已创建");
        }
      } else if (existingDept) {
        // 部门ID为空/null且有现有关联，需删除关联
        logger.info(`移除用户(${userId})的部门关联, 关联ID: ${existingDept.id}`);
        const { error: deleteError } = await supabase
          .from('user_departments')
          .delete()
          .eq('id', existingDept.id)
          .eq('user_id', userId);
        
        if (deleteError) {
          logger.error("移除部门关联失败:", deleteError);
          toast.error(`移除部门关联失败: ${deleteError.message}`, { id: toastId });
          return { success: false, error: deleteError };
        }
        logger.info("部门关联已移除");
      } else {
        logger.info(`用户(${userId})没有部门关联，无需操作`);
      }
      
      return { success: true };
    } catch (error) {
      const err = error as Error;
      logger.error("部门关联处理失败:", err);
      toast.error(`部门关联操作失败: ${err.message}`, { id: toastId });
      return { success: false, error: err };
    }
  }
};
