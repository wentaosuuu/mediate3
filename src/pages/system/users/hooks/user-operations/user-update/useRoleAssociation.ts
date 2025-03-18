
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 用户-角色关联模块
 * 处理用户与角色之间的关联关系
 */
export const roleAssociationModule = {
  /**
   * 处理用户与角色的关联
   * @param userId 用户ID
   * @param roleId 角色ID
   */
  async handle(userId: string, roleId: string): Promise<void> {
    console.log(`开始处理用户(${userId})与角色(${roleId})的关联`);
    
    if (!userId || !roleId) {
      console.error("处理用户-角色关联失败: 用户ID或角色ID为空");
      toast.error("关联失败：用户ID或角色ID不能为空");
      throw new Error("用户ID和角色ID不能为空");
    }
    
    try {
      // 检查是否有现有关联
      const { data, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("检查用户-角色关联时出错:", checkError);
        toast.error(`检查角色关联失败: ${checkError.message}`);
        throw checkError;
      }
      
      // 使用upsert操作 - 如果存在则更新，否则插入
      const { error } = await supabase
        .from('user_roles')
        .upsert(
          { user_id: userId, role_id: roleId },
          { onConflict: 'user_id' }
        );
      
      if (error) {
        console.error("处理用户-角色关联失败:", error);
        toast.error(`角色关联处理失败: ${error.message}`);
        throw error;
      }
      
      console.log(`成功处理用户(${userId})与角色(${roleId})的关联`);
    } catch (error) {
      console.error("处理用户-角色关联过程中发生错误:", error);
      toast.error(`角色关联失败: ${(error as Error).message}`);
      throw error;
    }
  },
  
  /**
   * 移除用户的角色关联
   * @param userId 用户ID
   */
  async remove(userId: string): Promise<void> {
    console.log(`开始移除用户(${userId})的角色关联`);
    
    if (!userId) {
      console.error("移除用户-角色关联失败: 用户ID为空");
      toast.error("移除关联失败：用户ID不能为空");
      throw new Error("用户ID不能为空");
    }
    
    try {
      // 检查是否有现有关联
      const { data, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("检查用户-角色关联时出错:", checkError);
        toast.error(`检查角色关联失败: ${checkError.message}`);
        throw checkError;
      }
      
      if (!data) {
        console.log(`用户(${userId})没有角色关联，无需移除`);
        return;
      }
      
      console.log(`发现用户(${userId})的角色关联，准备移除...`);
      
      // 移除用户的角色关联
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (error) {
        console.error("移除用户-角色关联失败:", error);
        toast.error(`移除角色关联失败: ${error.message}`);
        throw error;
      }
      
      console.log(`成功移除用户(${userId})的角色关联`);
    } catch (error) {
      console.error("移除用户-角色关联过程中发生错误:", error);
      toast.error(`移除角色关联失败: ${(error as Error).message}`);
      throw error;
    }
  }
};
