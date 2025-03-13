
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

// 处理用户状态的钩子
export const useUserStatus = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 启用/禁用用户
  const toggleUserStatus = async (user: any, status: boolean) => {
    setIsLoading(true);
    try {
      // 实际应用中应该更新用户状态
      toast({
        title: status ? "用户已启用" : "用户已禁用",
        description: `用户 ${user.username} 状态已更新`,
      });
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('更新用户状态失败:', error);
      toast({
        title: "操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    toggleUserStatus
  };
};
