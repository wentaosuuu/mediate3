
import { supabase } from "@/integrations/supabase/client";

/**
 * 部门关联处理模块
 */
export const departmentAssociationModule = {
  /**
   * 检查用户是否已有部门关联
   */
  checkExisting: async (userId: string) => {
    console.log("检查用户部门关联, 用户ID:", userId);
    
    if (!userId) {
      console.error("检查用户部门关联失败: 用户ID为空");
      throw new Error("用户ID不能为空");
    }
    
    try {
      const { data, error } = await supabase
        .from('user_departments')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        console.error('检查用户部门关联时出错:', error);
        throw error;
      }
      
      console.log("用户部门关联检查结果:", data ? "存在" : "不存在");
      return data;
    } catch (error) {
      console.error('检查用户部门关联时发生错误:', error);
      throw error;
    }
  },

  /**
   * 创建新的部门关联
   */
  create: async (userId: string, departmentId: string) => {
    console.log("创建新的部门关联, 用户ID:", userId, "部门ID:", departmentId);
    
    if (!userId || !departmentId) {
      console.error("创建部门关联失败: 用户ID或部门ID为空");
      throw new Error("用户ID和部门ID不能为空");
    }
    
    try {
      const { error } = await supabase
        .from('user_departments')
        .insert({
          user_id: userId,
          department_id: departmentId
        });
        
      if (error) {
        console.error('创建部门关联失败:', error);
        throw error;
      } else {
        console.log('用户部门关联新建成功:', departmentId);
      }
    } catch (error) {
      console.error('创建部门关联过程中发生错误:', error);
      throw error;
    }
  },

  /**
   * 更新现有部门关联
   */
  update: async (userId: string, departmentId: string) => {
    console.log("更新部门关联, 用户ID:", userId, "新部门ID:", departmentId);
    
    if (!userId || !departmentId) {
      console.error("更新部门关联失败: 用户ID或部门ID为空");
      throw new Error("用户ID和部门ID不能为空");
    }
    
    try {
      const { error } = await supabase
        .from('user_departments')
        .update({ department_id: departmentId })
        .eq('user_id', userId);
        
      if (error) {
        console.error('更新部门关联失败:', error);
        throw error;
      } else {
        console.log('用户部门关联更新成功:', departmentId);
      }
    } catch (error) {
      console.error('更新部门关联过程中发生错误:', error);
      throw error;
    }
  },

  /**
   * 删除部门关联
   */
  delete: async (userId: string) => {
    console.log("删除部门关联, 用户ID:", userId);
    
    if (!userId) {
      console.error("删除部门关联失败: 用户ID为空");
      throw new Error("用户ID不能为空");
    }
    
    try {
      const { error } = await supabase
        .from('user_departments')
        .delete()
        .eq('user_id', userId);
        
      if (error && error.code !== 'PGRST116') {
        console.error('删除部门关联失败:', error);
        // 不抛出异常，允许继续处理
      } else {
        console.log('用户部门关联已删除或不存在');
      }
    } catch (error) {
      console.error('删除部门关联过程中发生错误:', error);
      // 不抛出异常，允许继续处理
    }
  },

  /**
   * 处理用户部门关联
   */
  handle: async (userId: string, departmentId?: string) => {
    try {
      console.log("处理用户部门关联, 用户ID:", userId, "部门ID:", departmentId || "无");
      
      if (!userId) {
        console.error("处理部门关联失败: 用户ID为空");
        throw new Error("用户ID不能为空");
      }
      
      if (departmentId) {
        // 有部门ID，需要关联或更新部门
        const existingDept = await departmentAssociationModule.checkExisting(userId);
        
        if (!existingDept) {
          // 没有现有关联，创建新的
          await departmentAssociationModule.create(userId, departmentId);
        } else {
          // 有现有关联，更新它
          await departmentAssociationModule.update(userId, departmentId);
        }
      } else {
        // 没有部门ID，删除现有关联（如果有的话）
        await departmentAssociationModule.delete(userId);
      }
      
      console.log("处理用户部门关联完成");
      return true; // 返回成功标志
    } catch (error) {
      console.error('处理部门关联时出错:', error);
      throw error;
    }
  }
};
