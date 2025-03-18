
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
    console.log(`处理用户(${userId})与部门(${departmentId})的关联`);
    
    try {
      // 首先检查用户是否已经有部门关联
      const { data: existingDepts, error: checkError } = await supabase
        .from('user_departments')
        .select('id')
        .eq('user_id', userId);
      
      if (checkError) {
        console.error("检查用户部门关联失败:", checkError);
        toast.error(`检查部门关联失败: ${checkError.message}`);
        throw checkError;
      }
      
      if (existingDepts && existingDepts.length > 0) {
        // 用户已有部门，更新现有关联
        const { error: updateError } = await supabase
          .from('user_departments')
          .update({ department_id: departmentId })
          .eq('user_id', userId);
        
        if (updateError) {
          console.error("更新用户部门关联失败:", updateError);
          toast.error(`更新部门关联失败: ${updateError.message}`);
          throw updateError;
        }
        
        console.log(`成功更新用户(${userId})的部门为(${departmentId})`);
      } else {
        // 用户没有部门，创建新关联
        const { error: insertError } = await supabase
          .from('user_departments')
          .insert({
            user_id: userId,
            department_id: departmentId
          });
        
        if (insertError) {
          console.error("创建用户部门关联失败:", insertError);
          toast.error(`创建部门关联失败: ${insertError.message}`);
          throw insertError;
        }
        
        console.log(`成功创建用户(${userId})与部门(${departmentId})的关联`);
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
    console.log(`移除用户(${userId})的部门关联`);
    
    try {
      const { error } = await supabase
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
