
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 处理用户-角色关联的模块
 */
const roleAssociationModule = {
  /**
   * 处理用户角色关联
   * @param userId 用户ID
   * @param roleId 角色ID
   */
  handle: async (userId: string, roleId: string): Promise<void> => {
    console.log(`处理用户(${userId})与角色(${roleId})的关联，开始处理...`);
    
    if (!userId) {
      console.error("处理角色关联失败: 用户ID为空");
      throw new Error("用户ID不能为空");
    }
    
    // 如果角色ID为"none"或者空字符串，则移除角色关联
    if (!roleId || roleId === "none") {
      console.log(`角色ID为空或"none"，将移除用户(${userId})的角色关联`);
      return await roleAssociationModule.remove(userId);
    }
    
    try {
      // 首先检查用户是否已经有角色关联
      const { data: existingRoles, error: checkError } = await supabase
        .from('user_roles')
        .select('id, role_id')
        .eq('user_id', userId);
      
      if (checkError) {
        console.error("检查用户角色关联失败:", checkError);
        toast.error(`检查角色关联失败: ${checkError.message}`);
        throw checkError;
      }
      
      console.log("查询到的现有角色关联:", existingRoles);
      
      if (existingRoles && existingRoles.length > 0) {
        // 用户已有角色，更新现有关联
        const existingRoleId = existingRoles[0].id;
        console.log(`用户已有角色关联(ID:${existingRoleId})，将更新为角色ID:${roleId}`);
        
        const { data: updateData, error: updateError } = await supabase
          .from('user_roles')
          .update({ role_id: roleId })
          .eq('id', existingRoleId)
          .select();
        
        if (updateError) {
          console.error("更新用户角色关联失败:", updateError);
          toast.error(`更新角色关联失败: ${updateError.message}`);
          throw updateError;
        }
        
        console.log(`成功更新用户(${userId})的角色为(${roleId})，结果:`, updateData);
      } else {
        // 用户没有角色，创建新关联
        console.log(`用户没有现有角色关联，将创建新关联，用户ID:${userId}, 角色ID:${roleId}`);
        
        const { data: insertData, error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_id: roleId
          })
          .select();
        
        if (insertError) {
          console.error("创建用户角色关联失败:", insertError);
          toast.error(`创建角色关联失败: ${insertError.message}`);
          throw insertError;
        }
        
        console.log(`成功创建用户(${userId})与角色(${roleId})的关联，结果:`, insertData);
      }
    } catch (error) {
      console.error("处理用户-角色关联过程中发生错误:", error);
      throw error;
    }
  },
  
  /**
   * 移除用户的角色关联
   * @param userId 用户ID
   */
  remove: async (userId: string): Promise<void> => {
    console.log(`移除用户(${userId})的角色关联，开始处理...`);
    
    if (!userId) {
      console.error("移除角色关联失败: 用户ID为空");
      throw new Error("用户ID不能为空");
    }
    
    try {
      // 检查用户是否有角色关联
      const { data: existingRoles, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId);
      
      if (checkError) {
        console.error("检查用户角色关联失败:", checkError);
        throw checkError;
      }
      
      // 如果用户没有角色关联，直接返回
      if (!existingRoles || existingRoles.length === 0) {
        console.log(`用户(${userId})没有角色关联，无需移除`);
        return;
      }
      
      console.log(`发现用户(${userId})的角色关联，准备移除...`);
      
      // 移除用户的角色关联
      const { data, error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error("移除用户角色关联失败:", error);
        toast.error(`移除角色关联失败: ${error.message}`);
        throw error;
      }
      
      console.log(`成功移除用户(${userId})的角色关联`);
    } catch (error) {
      console.error("移除用户-角色关联过程中发生错误:", error);
      throw error;
    }
  }
};

export { roleAssociationModule };
