
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 处理用户与角色的关联
 */
export const roleAssociationModule = {
  /**
   * 处理用户的角色关联
   * @param userId 用户ID
   * @param roleId 角色ID
   */
  handle: async (userId: string, roleId?: string): Promise<void> => {
    console.log("处理用户角色关联，用户ID:", userId, "角色ID:", roleId);
    
    try {
      if (!userId) {
        throw new Error("用户ID不能为空");
      }

      // 首先检查用户是否已有角色关联
      const { data: existingRoles, error: fetchError } = await supabase
        .from('user_roles')
        .select('id, role_id')
        .eq('user_id', userId);
        
      if (fetchError) {
        console.error("获取用户现有角色失败:", fetchError);
        throw fetchError;
      }
      
      console.log("用户现有角色:", existingRoles);
      
      // 如果未提供新角色ID或为空字符串
      if (!roleId || roleId.trim() === '') {
        // 如果有现有角色关联，则删除它们
        if (existingRoles && existingRoles.length > 0) {
          console.log("删除用户现有角色关联");
          const { error: deleteError } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', userId);
            
          if (deleteError) {
            console.error("删除用户角色关联失败:", deleteError);
            toast.error(`删除角色关联失败: ${deleteError.message}`);
            throw deleteError;
          }
          console.log("成功删除用户角色关联");
        } else {
          console.log("未提供角色ID且用户无现有角色，无需操作");
        }
        return;
      }
      
      // 如果用户已有角色关联
      if (existingRoles && existingRoles.length > 0) {
        // 检查是否需要更新(角色已经不同)
        const currentRoleId = existingRoles[0].role_id;
        
        if (currentRoleId !== roleId) {
          console.log("更新用户角色关联，从", currentRoleId, "到", roleId);
          const { error: updateError } = await supabase
            .from('user_roles')
            .update({ role_id: roleId })
            .eq('user_id', userId);
            
          if (updateError) {
            console.error("更新用户角色关联失败:", updateError);
            toast.error(`更新角色关联失败: ${updateError.message}`);
            throw updateError;
          }
          console.log("成功更新用户角色关联");
        } else {
          console.log("用户角色无变化，无需更新");
        }
      } else {
        // 如果用户没有角色关联，创建新的关联
        console.log("创建新的用户角色关联");
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_id: roleId
          });
          
        if (insertError) {
          console.error("创建用户角色关联失败:", insertError);
          toast.error(`创建角色关联失败: ${insertError.message}`);
          throw insertError;
        }
        console.log("成功创建用户角色关联");
      }
    } catch (error) {
      console.error("处理用户角色关联时出错:", error);
      throw error;
    }
  }
};
