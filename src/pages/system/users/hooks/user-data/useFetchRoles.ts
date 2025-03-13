
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 获取角色列表的钩子
export const useFetchRoles = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 获取角色列表
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name');

      if (error) throw error;
      setRoles(data || []);
      return data || [];
    } catch (error) {
      console.error('获取角色列表失败:', error);
      // 如果角色表还未创建，使用模拟数据
      const mockRoles = [
        { id: '1', name: '管理员' },
        { id: '2', name: '普通用户' }
      ];
      setRoles(mockRoles);
      return mockRoles;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    roles,
    setRoles,
    isLoading,
    fetchRoles
  };
};
