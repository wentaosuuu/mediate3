
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';

interface UseUserSubmitProps {
  currentUser: any | null;
  createUser: (values: UserFormValues) => Promise<boolean>;
  updateUser: (values: UserFormValues, currentUser: any) => Promise<boolean>;
}

/**
 * 处理用户表单提交的钩子
 * 负责根据当前状态调用创建或更新方法
 */
export const useUserSubmit = ({
  currentUser,
  createUser,
  updateUser
}: UseUserSubmitProps) => {
  const { toast } = useToast();

  // 处理用户创建或更新的统一入口
  const handleSubmit = async (values: UserFormValues): Promise<boolean> => {
    console.log("useUserSubmit - 处理表单提交，当前用户:", currentUser, "表单数据:", values);
    
    try {
      let success = false;
      if (currentUser) {
        // 更新现有用户
        console.log("更新用户流程开始");
        success = await updateUser(values, currentUser);
      } else {
        // 创建新用户
        console.log("创建用户流程开始");
        success = await createUser(values);
      }
      
      // 如果操作成功，刷新用户列表
      if (success) {
        console.log("操作成功，刷新列表");
        return true;
      } else {
        console.error("操作返回失败状态");
        return false;
      }
    } catch (error) {
      console.error("表单提交过程中出错:", error);
      toast({
        title: "操作失败",
        description: `发生错误: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleSubmit };
};
