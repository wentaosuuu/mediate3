
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 定义部门信息接口
interface DepartmentInfo {
  user_id: string;
  department_id: string;
  department_name: string;
}

// 获取用户列表的钩子
export const useFetchUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 获取用户列表
  const fetchUsers = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("开始获取用户列表...");
      
      // 获取用户基本信息
      const { data, error } = await supabase
        .from('users')
        .select(`
          id, 
          username, 
          email, 
          phone, 
          tenant_id, 
          created_at, 
          updated_at
        `);

      if (error) throw error;
      
      if (!data || data.length === 0) {
        console.log("没有找到用户");
        setUsers([]);
        setIsLoading(false);
        return;
      }
      
      console.log(`找到 ${data.length} 个用户`);
      
      // 获取用户关联的部门信息和角色信息
      const formattedUsers = await Promise.all(data.map(async (user) => {
        try {
          // 获取部门信息
          let departmentInfo: DepartmentInfo | null = null;
          
          try {
            const { data: deptData, error: deptError } = await supabase.rpc(
              'get_user_department',
              { p_user_id: user.id }
            );
            
            if (deptError) {
              console.error(`获取用户 ${user.id} 的部门信息失败:`, deptError);
            } else if (deptData && Array.isArray(deptData) && deptData.length > 0) {
              departmentInfo = deptData[0] as DepartmentInfo;
              console.log(`用户 ${user.id} 的部门信息:`, departmentInfo);
            }
          } catch (deptErr) {
            console.error(`处理用户 ${user.id} 的部门信息时出错:`, deptErr);
          }
          
          // 获取用户角色信息
          let roleId = "";
          let roleName = "";
          
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role_id')
              .eq('user_id', user.id)
              .single();
              
            if (roleError) {
              if (roleError.code !== 'PGRST116') { // PGRST116表示没有记录，这不是真正的错误
                console.error(`获取用户 ${user.id} 的角色ID失败:`, roleError);
              }
            } else if (roleData) {
              roleId = roleData.role_id;
              
              // 获取角色名称
              const { data: roleDetails, error: roleDetailsError } = await supabase
                .from('roles')
                .select('name')
                .eq('id', roleId)
                .single();
                
              if (roleDetailsError) {
                console.error(`获取角色 ${roleId} 的详细信息失败:`, roleDetailsError);
              } else if (roleDetails) {
                roleName = roleDetails.name;
                console.log(`用户 ${user.id} 的角色信息:`, { roleId, roleName });
              }
            }
          } catch (roleErr) {
            console.error(`处理用户 ${user.id} 的角色信息时出错:`, roleErr);
          }
          
          return {
            ...user,
            department_id: departmentInfo?.department_id || "",
            department_name: departmentInfo?.department_name || "-",
            role_id: roleId || "",
            role_name: roleName || "-"
          };
        } catch (err) {
          console.error(`处理用户 ${user.id} 的信息时出错:`, err);
          return {
            ...user,
            department_id: "",
            department_name: "-",
            role_id: "",
            role_name: "-"
          };
        }
      }));
      
      console.log("格式化后的用户列表:", formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('获取用户列表失败:', error);
      toast({
        title: "获取用户列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    setUsers,
    isLoading,
    setIsLoading,
    fetchUsers
  };
};
