
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from '../../../components/user-form/UserFormSchema';
import { toast } from "sonner";

/**
 * 更新用户基本信息
 * @param userId 用户ID
 * @param values 表单值
 * @param toastId 可选的toast通知ID，用于更新现有通知
 * @returns 更新后的用户数据
 */
export const updateUserBasicInfo = async (userId: string, values: UserFormValues, toastId?: string) => {
  console.log("更新用户基本信息，用户ID:", userId);
  
  if (!userId) {
    console.error("更新用户基本信息失败: 用户ID为空");
    toast.error("保存失败：用户ID不能为空", { id: toastId });
    throw new Error("用户ID不能为空");
  }
  
  try {
    // 构建更新数据对象
    const updateData = {
      username: values.username,
      name: values.name,
      email: values.email,
      phone: values.phone || null,
      updated_at: new Date().toISOString()
    };
    
    console.log("准备更新用户基本信息:", updateData);
    
    // 执行更新操作
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, username, name, email, phone');

    if (error) {
      console.error('更新用户基本信息失败:', error);
      toast.error(`保存失败：${error.message || '数据库更新错误'}`, { id: toastId });
      throw error;
    }
    
    console.log('用户基本信息更新成功:', data);
    return data?.[0] || null;
  } catch (error) {
    console.error('更新用户基本信息过程中发生错误:', error);
    toast.error(`保存失败：${(error as Error).message}`, { id: toastId });
    throw error;
  }
};
