
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 角色关联处理模块
 * 负责处理用户与角色的关联关系
 */
export const roleAssociationModule = {
  /**
   * 处理用户角色关联
   * @param userId 用户ID
   * @param roleId 角色ID
   */
  async handle(userId: string, roleId: string): Promise<void> {
    console.log("处理用户角色关联，用户ID:", userId, "角色ID:", roleId);
    
    try {
      // 检查是否已存在关联
      const { data: existingAssoc, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("检查用户角色关联失败:", checkError);
        throw new Error(`检查角色关联失败: ${checkError.message}`);
      }
      
      if (existingAssoc) {
        // 更新现有关联
        console.log("更新现有角色关联，ID:", existingAssoc.id);
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role_id: roleId })
          .eq('id', existingAssoc.id);
        
        if (updateError) {
          console.error("更新用户角色关联失败:", updateError);
          throw new Error(`更新角色关联失败: ${updateError.message}`);
        }
      } else {
        // 创建新关联
        console.log("创建新的角色关联");
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role_id: roleId });
        
        if (insertError) {
          console.error("创建用户角色关联失败:", insertError);
          throw new Error(`创建角色关联失败: ${insertError.message}`);
        }
      }
      
      console.log("角色关联处理成功");
    } catch (error) {
      console.error("角色关联处理失败:", error);
      toast.error(`角色关联失败：${(error as Error).message}`);
      throw error;
    }
  },

  /**
   * 移除用户角色关联
   * @param userId 用户ID
   */
  async remove(userId: string): Promise<void> {
    console.log("移除用户角色关联，用户ID:", userId);
    
    try {
      // 删除现有关联
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error("移除用户角色关联失败:", error);
        throw new Error(`移除角色关联失败: ${error.message}`);
      }
      
      console.log("角色关联已成功移除");
    } catch (error) {
      console.error("移除角色关联失败:", error);
      toast.error(`移除角色关联失败：${(error as Error).message}`);
      throw error;
    }
  }
};
