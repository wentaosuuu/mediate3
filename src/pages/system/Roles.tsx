
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// 角色表单验证模式
const roleFormSchema = z.object({
  name: z.string().min(2, { message: "角色名称至少需要2个字符" }),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
  tenant_id: z.string()
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

const RolesManagement = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const { toast } = useToast();

  // 表单初始化
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
      tenant_id: "default" // 在实际应用中应该从系统或登录用户获取
    }
  });

  // 获取角色列表
  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('roles')
        .select(`
          id, 
          name, 
          description, 
          tenant_id, 
          created_at, 
          updated_at
        `);

      if (error) {
        console.log("获取角色列表错误：", error);
        // 如果表不存在，显示提示信息
        if (error.code === "42P01") {
          toast({
            title: "角色表不存在",
            description: "需要先创建角色表并配置相关权限",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        // 使用模拟数据
        setRoles([
          { 
            id: '1', 
            name: '管理员', 
            description: '系统管理员，拥有所有权限', 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { 
            id: '2', 
            name: '普通用户', 
            description: '普通用户，拥有基本操作权限', 
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      } else {
        setRoles(data || []);
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
      toast({
        title: "获取角色列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取权限列表
  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('id, name');
        
      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('获取权限列表失败:', error);
      // 使用备用数据
      setPermissions([
        { id: 'user:create', name: '创建用户' },
        { id: 'user:read', name: '查看用户' },
        { id: 'user:update', name: '更新用户' },
        { id: 'user:delete', name: '删除用户' },
        { id: 'role:create', name: '创建角色' },
        { id: 'role:read', name: '查看角色' },
        { id: 'role:update', name: '更新角色' },
        { id: 'role:delete', name: '删除角色' },
        { id: 'department:create', name: '创建部门' },
        { id: 'department:read', name: '查看部门' },
        { id: 'department:update', name: '更新部门' },
        { id: 'department:delete', name: '删除部门' }
      ]);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // 处理角色创建或更新
  const handleSubmit = async (values: RoleFormValues) => {
    setIsLoading(true);
    try {
      if (currentRole) {
        // 更新角色
        const { error } = await supabase
          .from('roles')
          .update({
            name: values.name,
            description: values.description,
          })
          .eq('id', currentRole.id);

        if (error) throw error;
        
        // 处理权限关联
        if (values.permissions && values.permissions.length > 0) {
          // 先删除旧的权限关联
          await supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', currentRole.id);
            
          // 添加新的权限关联
          const rolePermissions = values.permissions.map(permissionId => ({
            role_id: currentRole.id,
            permission_id: permissionId
          }));
          
          const { error: permError } = await supabase
            .from('role_permissions')
            .insert(rolePermissions);
            
          if (permError) {
            console.error('更新角色权限失败:', permError);
          }
        }
        
        toast({
          title: "角色更新成功",
          description: `角色 ${values.name} 已更新`,
        });
      } else {
        // 创建角色
        const { data, error } = await supabase
          .from('roles')
          .insert({
            name: values.name,
            description: values.description,
            tenant_id: values.tenant_id,
          })
          .select();

        if (error) throw error;
        
        // 处理权限关联
        if (values.permissions && values.permissions.length > 0 && data && data.length > 0) {
          const roleId = data[0].id;
          const rolePermissions = values.permissions.map(permissionId => ({
            role_id: roleId,
            permission_id: permissionId
          }));
          
          const { error: permError } = await supabase
            .from('role_permissions')
            .insert(rolePermissions);
            
          if (permError) {
            console.error('设置角色权限失败:', permError);
          }
        }
        
        toast({
          title: "角色创建成功",
          description: `角色 ${values.name} 已创建`,
        });
      }
      
      // 刷新角色列表
      fetchRoles();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('角色操作失败:', error);
      toast({
        title: "角色操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 获取角色的权限
  const fetchRolePermissions = async (roleId: string) => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .eq('role_id', roleId);
        
      if (error) throw error;
      
      return data?.map(item => item.permission_id) || [];
    } catch (error) {
      console.error('获取角色权限失败:', error);
      return [];
    }
  };

  // 打开创建角色对话框
  const openCreateDialog = () => {
    setCurrentRole(null);
    form.reset({
      name: "",
      description: "",
      permissions: [],
      tenant_id: "default"
    });
    setIsDialogOpen(true);
  };

  // 打开编辑角色对话框
  const openEditDialog = async (role: any) => {
    setCurrentRole(role);
    
    // 获取角色的权限
    const rolePermissions = await fetchRolePermissions(role.id);
    
    form.reset({
      name: role.name,
      description: role.description || "",
      permissions: rolePermissions,
      tenant_id: role.tenant_id
    });
    setIsDialogOpen(true);
  };

  // 删除角色
  const deleteRole = async (roleId: string) => {
    if (!confirm("确定要删除此角色吗？此操作不可撤销。")) return;
    
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        if (error.code === "42P01") {
          toast({
            title: "角色表不存在",
            description: "需要先创建角色表",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "角色删除成功",
        });
        fetchRoles();
      }
    } catch (error) {
      console.error('删除角色失败:', error);
      toast({
        title: "删除角色失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 过滤角色列表
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          创建角色
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="搜索角色名称或描述"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>角色名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  加载中...
                </TableCell>
              </TableRow>
            ) : filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  没有找到角色
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description || '-'}</TableCell>
                  <TableCell>{new Date(role.created_at).toLocaleString()}</TableCell>
                  <TableCell>{role.updated_at ? new Date(role.updated_at).toLocaleString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(role)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteRole(role.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 角色表单对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentRole ? "编辑角色" : "创建角色"}</DialogTitle>
            <DialogDescription>
              {currentRole 
                ? "修改角色信息，完成后点击保存。" 
                : "填写角色信息，完成后点击创建。"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色名称</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入角色名称" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色描述</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入角色描述" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel>权限设置</FormLabel>
                    <div className="grid grid-cols-3 gap-3 border p-3 rounded-md">
                      {permissions.map(permission => (
                        <div key={permission.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={permission.id}
                            value={permission.id}
                            className="mr-2 h-4 w-4"
                            onChange={(e) => {
                              const currentPermissions = form.getValues('permissions') || [];
                              if (e.target.checked) {
                                form.setValue('permissions', [...currentPermissions, permission.id]);
                              } else {
                                form.setValue('permissions', currentPermissions.filter(id => id !== permission.id));
                              }
                            }}
                            checked={(form.getValues('permissions') || []).includes(permission.id)}
                          />
                          <label htmlFor={permission.id} className="text-sm">{permission.name}</label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "处理中..." : currentRole ? "保存" : "创建"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesManagement;

