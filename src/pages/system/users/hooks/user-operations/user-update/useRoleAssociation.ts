
import { supabase } from "@/integrations/supabase/client";

/**
 * 角色关联处理模块
 */
export const roleAssociationModule = {
  /**
   * 检查用户是否已有角色关联
   */
  checkExisting: async (userId: string) => {
    console.log("检查用户角色关联, 用户ID:", userId);
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('检查用户角色关联时出错:', error);
      throw error;
    }
    
    console.log("用户角色关联检查结果:", data ? "存在" : "不存在");
    return data;
  },

  /**
   * 创建新的角色关联
   */
  create: async (userId: string, roleId: string) => {
    console.log("创建新的角色关联, 用户ID:", userId, "角色ID:", roleId);
    
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId
      });
      
    if (error) {
      console.error('分配角色失败:', error);
      throw error;
    } else {
      console.log('用户角色新建成功:', roleId);
    }
  },

  /**
   * 更新现有角色关联
   */
  update: async (userId: string, roleId: string) => {
    console.log("更新角色关联, 用户ID:", userId, "新角色ID:", roleId);
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role_id: roleId })
      .eq('user_id', userId);
      
    if (error) {
      console.error('更新角色失败:', error);
      throw error;
    } else {
      console.log('用户角色更新成功:', roleId);
    }
  },

  /**
   * 删除角色关联
   */
  delete: async (userId: string) => {
    console.log("删除角色关联, 用户ID:", userId);
    
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
      
    if (error && error.code !== 'PGRST116') {
      console.error('删除角色关联失败:', error);
      // 不抛出异常，允许继续处理
    } else {
      console.log('用户角色关联已删除或不存在');
    }
  },

  /**
   * 处理用户角色关联
   */
  handle: async (userId: string, roleId?: string) => {
    try {
      console.log("处理用户角色关联, 用户ID:", userId, "角色ID:", roleId || "无");
      
      if (roleId) {
        // 有角色ID，需要关联或更新角色
        const existingRole = await roleAssociationModule.checkExisting(userId);
        
        if (!existingRole) {
          // 没有现有关联，创建新的
          await roleAssociationModule.create(userId, roleId);
        } else {
          // 有现有关联，更新它
          await roleAssociationModule.update(userId, roleId);
        }
      } else {
        // 没有角色ID，删除现有关联（如果有的话）
        await roleAssociationModule.delete(userId);
      }
      
      console.log("处理用户角色关联完成");
    } catch (error) {
      console.error('处理角色关联时出错:', error);
      throw error;
    }
  }
};
