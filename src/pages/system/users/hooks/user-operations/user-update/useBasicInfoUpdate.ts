
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from '../../../components/user-form/UserFormSchema';

/**
 * 更新用户基本信息
 * @param userId 用户ID
 * @param values 表单值
 */
export const updateUserBasicInfo = async (userId: string, values: UserFormValues) => {
  console.log("更新用户基本信息，用户ID:", userId, "数据:", values);
  
  if (!userId) {
    console.error("更新用户基本信息失败: 用户ID为空");
    throw new Error("用户ID不能为空");
  }
  
  try {
    const { error } = await supabase
      .from('users')
      .update({
        username: values.username,
        name: values.name,
        email: values.email,
        phone: values.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('更新用户基本信息失败:', error);
      throw error;
    } else {
      console.log('用户基本信息更新成功');
    }
  } catch (error) {
    console.error('更新用户基本信息过程中发生错误:', error);
    throw error;
  }
};
