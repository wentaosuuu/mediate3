
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 用户-部门关联模块
 * 处理用户与部门之间的关联关系
 */
export const departmentAssociationModule = {
  /**
   * 处理用户与部门的关联
   * @param userId 用户ID
   * @param departmentId 部门ID
   */
  async handle(userId: string, departmentId: string): Promise<void> {
    console.log(`开始处理用户(${userId})与部门(${departmentId})的关联`);
    
    if (!userId || !departmentId) {
      console.error("处理用户-部门关联失败: 用户ID或部门ID为空");
      toast.error("关联失败：用户ID或部门ID不能为空");
      throw new Error("用户ID和部门ID不能为空");
    }
    
    try {
      // 使用RPC函数处理部门关联
      console.log("调用RPC函数upsert_user_department");
      const { error } = await supabase.rpc(
        'upsert_user_department',
        { 
          p_user_id: userId, 
          p_department_id: departmentId 
        }
      );
      
      if (error) {
        console.error("部门关联处理失败:", error);
        toast.error(`部门关联处理失败: ${error.message}`);
        throw error;
      }
      
      console.log(`成功处理用户(${userId})与部门(${departmentId})的关联`);
    } catch (error) {
      console.error("处理用户-部门关联过程中发生错误:", error);
      toast.error(`部门关联失败: ${(error as Error).message}`);
      throw error;
    }
  },
  
  /**
   * 移除用户的部门关联
   * @param userId 用户ID
   */
  async remove(userId: string): Promise<void> {
    console.log(`开始移除用户(${userId})的部门关联`);
    
    if (!userId) {
      console.error("移除用户-部门关联失败: 用户ID为空");
      toast.error("移除关联失败：用户ID不能为空");
      throw new Error("用户ID不能为空");
    }
    
    try {
      // 检查是否有现有关联
      console.log(`检查用户(${userId})是否有部门关联`);
      const { data, error: checkError } = await supabase
        .from('user_departments')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("检查用户-部门关联时出错:", checkError);
        toast.error(`检查部门关联失败: ${checkError.message}`);
        throw checkError;
      }
      
      if (!data) {
        console.log(`用户(${userId})没有部门关联，无需移除`);
        return;
      }
      
      console.log(`发现用户(${userId})的部门关联，准备移除...`);
      
      // 移除用户的部门关联
      const { error } = await supabase
        .from('user_departments')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error("移除用户-部门关联失败:", error);
        toast.error(`移除部门关联失败: ${error.message}`);
        throw error;
      }
      
      console.log(`成功移除用户(${userId})的部门关联`);
    } catch (error) {
      console.error("移除用户-部门关联过程中发生错误:", error);
      toast.error(`移除部门关联失败: ${(error as Error).message}`);
      throw error;
    }
  }
};
