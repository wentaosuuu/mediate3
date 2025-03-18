
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Logger } from "@/utils/logger";

// 创建一个专门的日志记录器
const logger = new Logger("RoleAssociationModule");

/**
 * 用户-角色关联处理模块
 * 负责处理用户与角色之间的关联关系
 */
export const roleAssociationModule = {
  /**
   * 处理用户与角色的关联（创建或更新）
   * @param userId 用户ID
   * @param roleId 角色ID，如果为null或空字符串，则表示无角色
   * @param toastId 可选的toast通知ID，用于更新现有通知
   * @returns 操作结果对象，包含是否成功和可能的错误信息
   */
  async handle(userId: string, roleId: string | null, toastId?: string): Promise<{success: boolean; error?: Error}> {
    logger.info(`处理用户(${userId})的角色关联，角色ID: ${roleId || '无'}`);
    
    if (!userId) {
      const error = new Error("用户ID不能为空");
      logger.error("处理用户-角色关联失败:", error);
      toast.error("关联失败：用户ID不能为空", { id: toastId });
      return { success: false, error };
    }
    
    try {
      // 检查用户是否有现有角色关联
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('id, role_id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        logger.error("检查角色关联状态失败:", checkError);
        toast.error(`检查角色关联状态失败: ${checkError.message}`, { id: toastId });
        return { success: false, error: checkError };
      }
      
      // 处理角色关联
      if (roleId) {
        // 有角色ID，需要创建或更新关联
        if (existingRole) {
          // 有现有关联，执行更新
          logger.info(`更新角色关联，用户ID: ${userId}, 角色ID: ${roleId}, 现有关联ID: ${existingRole.id}`);
          const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role_id: roleId })
            .eq('id', existingRole.id)
            .eq('user_id', userId);
            
          if (updateError) {
            logger.error("更新角色关联失败:", updateError);
            toast.error(`更新角色关联失败: ${updateError.message}`, { id: toastId });
            return { success: false, error: updateError };
          }
          logger.info("角色关联已更新");
        } else {
          // 无现有关联，创建新关联
          logger.info(`创建角色关联，用户ID: ${userId}, 角色ID: ${roleId}`);
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role_id: roleId });
            
          if (insertError) {
            logger.error("创建角色关联失败:", insertError);
            toast.error(`创建角色关联失败: ${insertError.message}`, { id: toastId });
            return { success: false, error: insertError };
          }
          logger.info("角色关联已创建");
        }
      } else if (existingRole) {
        // 角色ID为空/null且有现有关联，需删除关联
        logger.info(`移除用户(${userId})的角色关联, 关联ID: ${existingRole.id}`);
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('id', existingRole.id)
          .eq('user_id', userId);
        
        if (deleteError) {
          logger.error("移除角色关联失败:", deleteError);
          toast.error(`移除角色关联失败: ${deleteError.message}`, { id: toastId });
          return { success: false, error: deleteError };
        }
        logger.info("角色关联已移除");
      } else {
        logger.info(`用户(${userId})没有角色关联，无需操作`);
      }
      
      return { success: true };
    } catch (error) {
      const err = error as Error;
      logger.error("角色关联处理失败:", err);
      toast.error(`角色关联操作失败: ${err.message}`, { id: toastId });
      return { success: false, error: err };
    }
  }
};
