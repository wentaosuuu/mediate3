
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * 用户-部门关联处理模块
 * 负责处理用户与部门之间的关联关系
 */
export const departmentAssociationModule = {
  /**
   * 处理用户与部门的关联（创建或更新）
   * @param userId 用户ID
   * @param departmentId 部门ID，如果为null或空字符串，则表示无部门
   * @param toastId 可选的toast通知ID，用于更新现有通知
   */
  async handle(userId: string, departmentId: string | null, toastId?: string): Promise<void> {
    console.log(`处理用户(${userId})的部门关联，部门ID: ${departmentId || '无'}`);
    
    if (!userId) {
      console.error("处理用户-部门关联失败: 用户ID为空");
      toast.error("关联失败：用户ID不能为空", { id: toastId });
      throw new Error("用户ID不能为空");
    }
    
    try {
      // 检查用户是否有现有部门关联
      const { data: existingDept, error: checkError } = await supabase
        .from('user_departments')
        .select('id, department_id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (checkError) {
        console.error("检查部门关联状态失败:", checkError);
        throw checkError;
      }
      
      // 处理部门关联
      if (departmentId) {
        // 有部门ID，需要创建或更新关联
        if (existingDept) {
          // 有现有关联，执行更新
          console.log(`更新部门关联，用户ID: ${userId}, 部门ID: ${departmentId}`);
          const { error: updateError } = await supabase
            .from('user_departments')
            .update({ department_id: departmentId })
            .eq('id', existingDept.id)
            .eq('user_id', userId);
            
          if (updateError) {
            console.error("更新部门关联失败:", updateError);
            toast.error(`更新部门关联失败: ${updateError.message}`, { id: toastId });
            throw updateError;
          }
          console.log("部门关联已更新");
        } else {
          // 无现有关联，创建新关联
          console.log(`创建部门关联，用户ID: ${userId}, 部门ID: ${departmentId}`);
          const { error: insertError } = await supabase
            .from('user_departments')
            .insert({ user_id: userId, department_id: departmentId });
            
          if (insertError) {
            console.error("创建部门关联失败:", insertError);
            toast.error(`创建部门关联失败: ${insertError.message}`, { id: toastId });
            throw insertError;
          }
          console.log("部门关联已创建");
        }
      } else if (existingDept) {
        // 部门ID为空/null且有现有关联，需删除关联
        console.log(`移除用户(${userId})的部门关联`);
        const { error: deleteError } = await supabase
          .from('user_departments')
          .delete()
          .eq('id', existingDept.id)
          .eq('user_id', userId);
        
        if (deleteError) {
          console.error("移除部门关联失败:", deleteError);
          toast.error(`移除部门关联失败: ${deleteError.message}`, { id: toastId });
          throw deleteError;
        }
        console.log("部门关联已移除");
      } else {
        console.log(`用户(${userId})没有部门关联，无需操作`);
      }
    } catch (error) {
      console.error("部门关联处理失败:", error);
      toast.error(`部门关联操作失败: ${(error as Error).message}`, { id: toastId });
      throw error;
    }
  }
};
