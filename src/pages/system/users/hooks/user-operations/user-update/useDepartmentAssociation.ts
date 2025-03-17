
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 处理用户与部门的关联
 */
export const departmentAssociationModule = {
  /**
   * 处理用户的部门关联
   * @param userId 用户ID
   * @param departmentId 部门ID
   */
  handle: async (userId: string, departmentId?: string): Promise<void> => {
    console.log("处理用户部门关联，用户ID:", userId, "部门ID:", departmentId);
    
    try {
      if (!userId) {
        throw new Error("用户ID不能为空");
      }
      
      // 首先检查用户是否已有部门关联
      const { data: existingDepts, error: fetchError } = await supabase
        .from('user_departments')
        .select('id, department_id')
        .eq('user_id', userId);
        
      if (fetchError) {
        console.error("获取用户现有部门失败:", fetchError);
        throw fetchError;
      }
      
      console.log("用户现有部门:", existingDepts);
      
      // 如果未提供新部门ID或为空字符串
      if (!departmentId || departmentId.trim() === '') {
        // 如果有现有部门关联，则删除它们
        if (existingDepts && existingDepts.length > 0) {
          console.log("删除用户现有部门关联");
          const { error: deleteError } = await supabase
            .from('user_departments')
            .delete()
            .eq('user_id', userId);
            
          if (deleteError) {
            console.error("删除用户部门关联失败:", deleteError);
            toast.error(`删除部门关联失败: ${deleteError.message}`);
            throw deleteError;
          }
          console.log("成功删除用户部门关联");
        } else {
          console.log("未提供部门ID且用户无现有部门，无需操作");
        }
        return;
      }
      
      // 如果用户已有部门关联
      if (existingDepts && existingDepts.length > 0) {
        const currentDeptId = existingDepts[0].department_id;
        
        // 检查是否需要更新(部门已经不同)
        if (currentDeptId !== departmentId) {
          console.log("更新用户部门关联，从", currentDeptId, "到", departmentId);
          const { error: updateError } = await supabase
            .from('user_departments')
            .update({ department_id: departmentId })
            .eq('user_id', userId);
            
          if (updateError) {
            console.error("更新用户部门关联失败:", updateError);
            toast.error(`更新部门关联失败: ${updateError.message}`);
            throw updateError;
          }
          console.log("成功更新用户部门关联");
        } else {
          console.log("用户部门无变化，无需更新");
        }
      } else {
        // 如果用户没有部门关联，创建新的关联
        console.log("创建新的用户部门关联");
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
        console.log("成功创建用户部门关联");
      }
    } catch (error) {
      console.error("处理用户部门关联时出错:", error);
      throw error;
    }
  }
};
