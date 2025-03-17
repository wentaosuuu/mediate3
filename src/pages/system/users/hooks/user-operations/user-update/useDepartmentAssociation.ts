
import { supabase } from "@/integrations/supabase/client";

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
      
      if (!departmentId || departmentId.trim() === '') {
        console.log("未提供部门ID或部门ID为空，跳过部门关联");
        return;
      }
      
      console.log("调用Supabase RPC函数处理用户-部门关联");
      
      const { data, error } = await supabase.rpc(
        'upsert_user_department',
        { 
          p_user_id: userId, 
          p_department_id: departmentId 
        }
      );
      
      if (error) {
        console.error("设置用户部门关联失败:", error);
        throw error;
      }
      
      console.log("用户部门关联处理成功", data);
    } catch (error) {
      console.error("处理用户部门关联时出错:", error);
      throw error;
    }
  }
};
