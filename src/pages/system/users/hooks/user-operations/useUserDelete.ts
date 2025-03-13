
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 处理用户删除的钩子
export const useUserDelete = (fetchUsers: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 删除用户
  const deleteUser = async (userId: string) => {
    if (!confirm("确定要删除此用户吗？此操作不可撤销。")) return false;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      toast({
        title: "用户删除成功",
      });
      
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('删除用户失败:', error);
      toast({
        title: "删除用户失败",
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
    deleteUser
  };
};
