
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from '../../../components/user-form/UserFormSchema';
import { toast } from "sonner";

/**
 * 更新用户基本信息
 * @param userId 用户ID
 * @param values 表单值
 */
export const updateUserBasicInfo = async (userId: string, values: UserFormValues) => {
  console.log("更新用户基本信息，用户ID:", userId, "数据:", values);
  
  if (!userId) {
    console.error("更新用户基本信息失败: 用户ID为空");
    toast.error("保存失败：用户ID不能为空");
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
    
    console.log("准备更新用户基本信息，更新数据:", updateData);
    
    // 执行更新操作
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, username, name, email, phone');

    if (error) {
      console.error('更新用户基本信息失败:', error);
      toast.error(`保存失败：${error.message || '数据库更新错误'}`);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('更新成功但未返回用户数据');
      // 使用select查询获取更新后的用户数据
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('id, username, name, email, phone')
        .eq('id', userId)
        .single();
        
      if (fetchError) {
        console.error('获取更新后的用户数据失败:', fetchError);
      } else {
        console.log('手动获取更新后的用户数据:', userData);
        toast.success("用户信息保存成功");
        return userData;
      }
    } else {
      console.log('用户基本信息更新成功，返回数据:', data);
      toast.success("用户信息保存成功");
      return data[0];
    }
  } catch (error) {
    console.error('更新用户基本信息过程中发生错误:', error);
    toast.error(`保存失败：${error instanceof Error ? error.message : '未知错误'}`);
    throw error;
  }
};
