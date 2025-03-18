
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
      // 使用RPC调用upsert_user_department函数
      const { error } = await supabase.rpc(
        'upsert_user_department',
        { 
          p_user_id: userId, 
          p_department_id: departmentId 
        }
      );
      
      if (error) {
        console.error("设置用户部门关联失败:", error);
        toast.error(`设置部门失败: ${error.message}`);
        throw error;
      }
      
      console.log(`成功设置用户(${userId})的部门为(${departmentId})`);
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
