
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 处理用户-部门关联的模块
 */
const departmentAssociationModule = {
  /**
   * 处理用户部门关联
   * @param userId 用户ID
   * @param departmentId 部门ID
   */
  handle: async (userId: string, departmentId: string): Promise<void> => {
    console.log(`处理用户(${userId})与部门(${departmentId})的关联，开始处理...`);
    
    if (!userId) {
      console.error("处理部门关联失败: 用户ID为空");
      throw new Error("用户ID不能为空");
    }
    
    // 如果部门ID为"none"或者空字符串，则移除部门关联
    if (!departmentId || departmentId === "none") {
      console.log(`部门ID为空或"none"，将移除用户(${userId})的部门关联`);
      return await departmentAssociationModule.remove(userId);
    }
    
    try {
      // 首先检查用户是否已经有部门关联
      const { data: existingDepts, error: checkError } = await supabase
        .from('user_departments')
        .select('id, department_id')
        .eq('user_id', userId);
      
      if (checkError) {
        console.error("检查用户部门关联失败:", checkError);
        toast.error(`检查部门关联失败: ${checkError.message}`);
        throw checkError;
      }
      
      console.log("查询到的现有部门关联:", existingDepts);
      
      if (existingDepts && existingDepts.length > 0) {
        // 用户已有部门，更新现有关联
        const existingDeptId = existingDepts[0].id;
        console.log(`用户已有部门关联(ID:${existingDeptId})，将更新为部门ID:${departmentId}`);
        
        const { data: updateData, error: updateError } = await supabase
          .from('user_departments')
          .update({ department_id: departmentId })
          .eq('id', existingDeptId)
          .select();
        
        if (updateError) {
          console.error("更新用户部门关联失败:", updateError);
          toast.error(`更新部门关联失败: ${updateError.message}`);
          throw updateError;
        }
        
        console.log(`成功更新用户(${userId})的部门为(${departmentId})，结果:`, updateData);
      } else {
        // 用户没有部门，创建新关联
        console.log(`用户没有现有部门关联，将创建新关联，用户ID:${userId}, 部门ID:${departmentId}`);
        
        const { data: insertData, error: insertError } = await supabase
          .from('user_departments')
          .insert({
            user_id: userId,
            department_id: departmentId
          })
          .select();
        
        if (insertError) {
          console.error("创建用户部门关联失败:", insertError);
          toast.error(`创建部门关联失败: ${insertError.message}`);
          throw insertError;
        }
        
        console.log(`成功创建用户(${userId})与部门(${departmentId})的关联，结果:`, insertData);
      }
    } catch (error) {
      console.error("处理用户-部门关联过程中发生错误:", error);
      throw error;
    }
  },
  
  /**
   * 移除用户的部门关联
   * @param userId 用户ID
   */
  remove: async (userId: string): Promise<void> => {
    console.log(`移除用户(${userId})的部门关联，开始处理...`);
    
    if (!userId) {
      console.error("移除部门关联失败: 用户ID为空");
      throw new Error("用户ID不能为空");
    }
    
    try {
      // 检查用户是否有部门关联
      const { data: existingDepts, error: checkError } = await supabase
        .from('user_departments')
        .select('id')
        .eq('user_id', userId);
      
      if (checkError) {
        console.error("检查用户部门关联失败:", checkError);
        throw checkError;
      }
      
      // 如果用户没有部门关联，直接返回
      if (!existingDepts || existingDepts.length === 0) {
        console.log(`用户(${userId})没有部门关联，无需移除`);
        return;
      }
      
      console.log(`发现用户(${userId})的部门关联，准备移除...`);
      
      // 移除用户的部门关联
      const { data, error } = await supabase
        .from('user_departments')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error("移除用户部门关联失败:", error);
        toast.error(`移除部门关联失败: ${error.message}`);
        throw error;
      }
      
      console.log(`成功移除用户(${userId})的部门关联`);
    } catch (error) {
      console.error("移除用户-部门关联过程中发生错误:", error);
      throw error;
    }
  }
};

export { departmentAssociationModule };
