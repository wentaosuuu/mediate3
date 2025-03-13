
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const createRolesTable = async () => {
  const { toast } = useToast();
  
  try {
    // 检查roles表是否存在
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'roles');
    
    if (checkError) throw checkError;
    
    // 如果roles表不存在，创建它
    if (!existingTables || existingTables.length === 0) {
      // 创建roles表
      // 注意：实际上我们不能使用客户端SDK创建表，这只是一个示例
      // 应该通过SQL或Supabase管理界面创建表
      
      toast({
        title: "需要创建角色表",
        description: "请通过Supabase SQL编辑器或管理界面创建角色表",
        variant: "destructive",
      });
      
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('检查或创建角色表失败:', error);
    toast({
      title: "操作失败",
      description: (error as Error).message,
      variant: "destructive",
    });
    
    return false;
  }
};

// SQL创建角色和权限表的参考代码
/*
-- 创建角色表
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  tenant_id VARCHAR NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 创建权限表
CREATE TABLE public.permissions (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 创建角色-权限关联表
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id VARCHAR REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

-- 创建用户-角色关联表
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role_id)
);
*/
