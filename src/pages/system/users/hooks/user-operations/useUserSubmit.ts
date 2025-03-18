
import { useToast } from "@/hooks/use-toast";
import { UserFormValues } from '../../components/user-form/UserFormSchema';
import { toast } from "sonner";

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
  const { toast: uiToast } = useToast();

  // 处理用户创建或更新的统一入口
  const handleSubmit = async (values: UserFormValues): Promise<boolean> => {
    console.log("useUserSubmit - 处理表单提交，当前用户:", currentUser, "表单数据:", values);
    
    try {
      // 处理特殊值"none"，将其转换为空字符串
      const processedValues = {
        ...values,
        department_id: values.department_id === "none" ? "" : values.department_id,
        role_id: values.role_id === "none" ? "" : values.role_id
      };
      
      console.log("处理后的提交数据:", processedValues);
      
      let success = false;
      if (currentUser) {
        // 更新现有用户
        console.log("更新用户流程开始，用户ID:", currentUser.id);
        toast.loading("正在更新用户...");
        success = await updateUser(processedValues, currentUser);
        console.log("更新用户流程结束，结果:", success);
      } else {
        // 创建新用户
        console.log("创建用户流程开始");
        toast.loading("正在创建用户...");
        success = await createUser(processedValues);
        console.log("创建用户流程结束，结果:", success);
      }
      
      // 如果操作成功，返回结果
      if (success) {
        toast.success(`用户${currentUser ? "更新" : "创建"}成功`);
        console.log("操作成功，返回true");
        return true;
      } else {
        console.error("操作返回失败状态");
        toast.error(`用户${currentUser ? "更新" : "创建"}失败`);
        return false;
      }
    } catch (error) {
      console.error("表单提交过程中出错:", error);
      toast.error(`发生错误: ${(error as Error).message}`);
      uiToast({
        title: "操作失败",
        description: `发生错误: ${(error as Error).message}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleSubmit };
};
