
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 部门关联处理模块
 * 负责处理用户与部门的关联关系
 */
export const departmentAssociationModule = {
  /**
   * 处理用户部门关联
   * @param userId 用户ID
   * @param departmentId 部门ID
   */
  async handle(userId: string, departmentId: string): Promise<void> {
    console.log("处理用户部门关联，用户ID:", userId, "部门ID:", departmentId);
    
    try {
      // 检查是否已存在关联
      const { data: existingAssoc, error: checkError } = await supabase
        .from('user_departments')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("检查用户部门关联失败:", checkError);
        throw new Error(`检查部门关联失败: ${checkError.message}`);
      }
      
      if (existingAssoc) {
        // 更新现有关联
        console.log("更新现有部门关联，ID:", existingAssoc.id);
        const { error: updateError } = await supabase
          .from('user_departments')
          .update({ department_id: departmentId })
          .eq('id', existingAssoc.id);
        
        if (updateError) {
          console.error("更新用户部门关联失败:", updateError);
          throw new Error(`更新部门关联失败: ${updateError.message}`);
        }
      } else {
        // 创建新关联
        console.log("创建新的部门关联");
        const { error: insertError } = await supabase
          .from('user_departments')
          .insert({ user_id: userId, department_id: departmentId });
        
        if (insertError) {
          console.error("创建用户部门关联失败:", insertError);
          throw new Error(`创建部门关联失败: ${insertError.message}`);
        }
      }
      
      console.log("部门关联处理成功");
    } catch (error) {
      console.error("部门关联处理失败:", error);
      toast.error(`部门关联失败：${(error as Error).message}`);
      throw error;
    }
  },

  /**
   * 移除用户部门关联
   * @param userId 用户ID
   */
  async remove(userId: string): Promise<void> {
    console.log("移除用户部门关联，用户ID:", userId);
    
    try {
      // 删除现有关联
      const { error } = await supabase
        .from('user_departments')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error("移除用户部门关联失败:", error);
        throw new Error(`移除部门关联失败: ${error.message}`);
      }
      
      console.log("部门关联已成功移除");
    } catch (error) {
      console.error("移除部门关联失败:", error);
      toast.error(`移除部门关联失败：${(error as Error).message}`);
      throw error;
    }
  }
};
