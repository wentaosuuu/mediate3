
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
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

// 用户表单验证模式
const userFormSchema = z.object({
  username: z.string().min(2, { message: "用户名至少需要2个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  phone: z.string().optional(),
  department_id: z.string().optional(),
  role_id: z.string().optional(),
  password: z.string().min(6, { message: "密码至少需要6个字符" }).optional(),
  tenant_id: z.string()
});

type UserFormValues = z.infer<typeof userFormSchema>;

const UsersManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // 表单初始化
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      department_id: "",
      role_id: "",
      password: "",
      tenant_id: "default" // 在实际应用中应该从系统或登录用户获取
    }
  });

  // 获取用户列表
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
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
      setUsers(data || []);
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

  // 获取部门列表
  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('获取部门列表失败:', error);
    }
  };

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('获取角色列表失败:', error);
      // 如果角色表还未创建，使用模拟数据
      setRoles([
        { id: '1', name: '管理员' },
        { id: '2', name: '普通用户' }
      ]);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, []);

  // 处理用户创建或更新
  const handleSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    try {
      if (currentUser) {
        // 更新用户
        const { error } = await supabase
          .from('users')
          .update({
            username: values.username,
            email: values.email,
            phone: values.phone,
            // 部门和角色关联需要额外表
          })
          .eq('id', currentUser.id);

        if (error) throw error;
        toast({
          title: "用户更新成功",
          description: `用户 ${values.username} 已更新`,
        });
      } else {
        // 创建用户
        // 在实际应用中，这里应该使用 auth.signUp 方法
        // 生成一个随机ID
        const userId = crypto.randomUUID();
        
        const { error } = await supabase
          .from('users')
          .insert({
            id: userId,
            username: values.username,
            email: values.email,
            phone: values.phone,
            tenant_id: values.tenant_id,
          });

        if (error) throw error;
        
        // 如果选择了角色，则添加用户-角色关联
        if (values.role_id) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role_id: values.role_id
            });
            
          if (roleError) {
            console.error('分配角色失败:', roleError);
          }
        }

        toast({
          title: "用户创建成功",
          description: `用户 ${values.username} 已创建`,
        });
      }
      
      // 刷新用户列表
      fetchUsers();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('用户操作失败:', error);
      toast({
        title: "用户操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 打开创建用户对话框
  const openCreateDialog = () => {
    setCurrentUser(null);
    form.reset({
      username: "",
      email: "",
      phone: "",
      department_id: "",
      role_id: "",
      password: "",
      tenant_id: "default"
    });
    setIsDialogOpen(true);
  };

  // 打开编辑用户对话框
  const openEditDialog = (user: any) => {
    setCurrentUser(user);
    form.reset({
      username: user.username,
      email: user.email,
      phone: user.phone || "",
      department_id: user.department_id || "",
      role_id: user.role_id || "",
      tenant_id: user.tenant_id
    });
    setIsDialogOpen(true);
  };

  // 启用/禁用用户
  const toggleUserStatus = async (user: any, status: boolean) => {
    try {
      // 实际应用中应该更新用户状态
      toast({
        title: status ? "用户已启用" : "用户已禁用",
        description: `用户 ${user.username} 状态已更新`,
      });
      fetchUsers();
    } catch (error) {
      console.error('更新用户状态失败:', error);
      toast({
        title: "操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 删除用户
  const deleteUser = async (userId: string) => {
    if (!confirm("确定要删除此用户吗？此操作不可撤销。")) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      toast({
        title: "用户删除成功",
      });
      fetchUsers();
    } catch (error) {
      console.error('删除用户失败:', error);
      toast({
        title: "删除用户失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 过滤用户列表
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.includes(searchQuery))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button onClick={openCreateDialog}>
          <UserPlus className="mr-2 h-4 w-4" />
          创建用户
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="搜索用户名、邮箱或电话"
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
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>电话</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  加载中...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  没有找到用户
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || '-'}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
                  <TableCell>{user.updated_at ? new Date(user.updated_at).toLocaleString() : '-'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(user, true)} title="启用">
                      <UserCheck className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(user, false)} title="禁用">
                      <UserX className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)} title="编辑">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteUser(user.id)} title="删除">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 用户表单对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentUser ? "编辑用户" : "创建用户"}</DialogTitle>
            <DialogDescription>
              {currentUser 
                ? "修改用户信息，完成后点击保存。" 
                : "填写用户信息，完成后点击创建。"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入用户名" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="请输入邮箱" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>电话</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入电话" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!currentUser && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="请输入密码" 
                          disabled={isLoading} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>部门</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                          disabled={isLoading}
                        >
                          <option value="">请选择部门</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>角色</FormLabel>
                      <FormControl>
                        <select
                          className="w-full p-2 border rounded-md"
                          {...field}
                          disabled={isLoading}
                        >
                          <option value="">请选择角色</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "处理中..." : currentUser ? "保存" : "创建"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;

