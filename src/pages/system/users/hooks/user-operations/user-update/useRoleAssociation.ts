
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
   */
  async handle(userId: string, roleId: string | null, toastId?: string): Promise<void> {
    console.log(`处理用户(${userId})的角色关联，角色ID: ${roleId || '无'}`);
    
    if (!userId) {
      console.error("处理用户-角色关联失败: 用户ID为空");
      toast.error("关联失败：用户ID不能为空", { id: toastId });
      throw new Error("用户ID不能为空");
    }
    
    try {
      // 检查用户是否有现有角色关联
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('id, role_id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("检查角色关联状态失败:", checkError);
        throw checkError;
      }
      
      // 处理角色关联
      if (roleId) {
        // 有角色ID，需要创建或更新关联
        if (existingRole) {
          // 有现有关联，执行更新
          console.log(`更新角色关联，用户ID: ${userId}, 角色ID: ${roleId}`);
          const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role_id: roleId })
            .eq('id', existingRole.id)
            .eq('user_id', userId);
            
          if (updateError) {
            console.error("更新角色关联失败:", updateError);
            toast.error(`更新角色关联失败: ${updateError.message}`, { id: toastId });
            throw updateError;
          }
          console.log("角色关联已更新");
        } else {
          // 无现有关联，创建新关联
          console.log(`创建角色关联，用户ID: ${userId}, 角色ID: ${roleId}`);
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role_id: roleId });
            
          if (insertError) {
            console.error("创建角色关联失败:", insertError);
            toast.error(`创建角色关联失败: ${insertError.message}`, { id: toastId });
            throw insertError;
          }
          console.log("角色关联已创建");
        }
      } else if (existingRole) {
        // 角色ID为空/null且有现有关联，需删除关联
        console.log(`移除用户(${userId})的角色关联`);
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('id', existingRole.id)
          .eq('user_id', userId);
        
        if (deleteError) {
          console.error("移除角色关联失败:", deleteError);
          toast.error(`移除角色关联失败: ${deleteError.message}`, { id: toastId });
          throw deleteError;
        }
        console.log("角色关联已移除");
      } else {
        console.log(`用户(${userId})没有角色关联，无需操作`);
      }
    } catch (error) {
      console.error("角色关联处理失败:", error);
      toast.error(`角色关联操作失败: ${(error as Error).message}`, { id: toastId });
      throw error;
    }
  }
};
