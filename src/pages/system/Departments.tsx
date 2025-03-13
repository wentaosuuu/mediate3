
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/dashboard/Navigation';
import { TopBar } from '@/components/dashboard/TopBar';
import { MainContent } from '@/components/dashboard/MainContent';
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

// 部门表单验证模式
const departmentFormSchema = z.object({
  name: z.string().min(2, { message: "部门名称至少需要2个字符" }),
  description: z.string().optional(),
  tenant_id: z.string()
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

const DepartmentsManagement = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<any>(null);
  const { toast } = useToast();

  // 表单初始化
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      tenant_id: "default" // 在实际应用中应该从系统或登录用户获取
    }
  });

  // 获取部门列表
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          id, 
          name, 
          description, 
          tenant_id, 
          created_at, 
          updated_at
        `);

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('获取部门列表失败:', error);
      toast({
        title: "获取部门列表失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchDepartments();
  }, []);

  // 处理部门创建或更新
  const handleSubmit = async (values: DepartmentFormValues) => {
    setIsLoading(true);
    try {
      if (currentDepartment) {
        // 更新部门
        const { error } = await supabase
          .from('departments')
          .update({
            name: values.name,
            description: values.description
          })
          .eq('id', currentDepartment.id);

        if (error) throw error;
        toast({
          title: "部门更新成功",
          description: `部门 ${values.name} 已更新`,
        });
      } else {
        // 创建部门
        const { error } = await supabase
          .from('departments')
          .insert({
            name: values.name,
            description: values.description,
            tenant_id: values.tenant_id
          });

        if (error) throw error;
        toast({
          title: "部门创建成功",
          description: `部门 ${values.name} 已创建`,
        });
      }
      
      // 刷新部门列表
      fetchDepartments();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('部门操作失败:', error);
      toast({
        title: "部门操作失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 打开创建部门对话框
  const openCreateDialog = () => {
    setCurrentDepartment(null);
    form.reset({
      name: "",
      description: "",
      tenant_id: "default"
    });
    setIsDialogOpen(true);
  };

  // 打开编辑部门对话框
  const openEditDialog = (department: any) => {
    setCurrentDepartment(department);
    form.reset({
      name: department.name,
      description: department.description || "",
      tenant_id: department.tenant_id
    });
    setIsDialogOpen(true);
  };

  // 删除部门
  const deleteDepartment = async (departmentId: string) => {
    if (!confirm("确定要删除此部门吗？此操作不可撤销。")) return;
    
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', departmentId);

      if (error) throw error;
      toast({
        title: "部门删除成功",
      });
      fetchDepartments();
    } catch (error) {
      console.error('删除部门失败:', error);
      toast({
        title: "删除部门失败",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  // 过滤部门列表
  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (department.description && department.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">部门管理</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          创建部门
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="搜索部门名称或描述"
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
              <TableHead>部门名称</TableHead>
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
            ) : filteredDepartments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  没有找到部门
                </TableCell>
              </TableRow>
            ) : (
              filteredDepartments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description || '-'}</TableCell>
                  <TableCell>{new Date(department.created_at).toLocaleString()}</TableCell>
                  <TableCell>{department.updated_at ? new Date(department.updated_at).toLocaleString() : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(department)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteDepartment(department.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 部门表单对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentDepartment ? "编辑部门" : "创建部门"}</DialogTitle>
            <DialogDescription>
              {currentDepartment 
                ? "修改部门信息，完成后点击保存。" 
                : "填写部门信息，完成后点击创建。"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>部门名称</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入部门名称" disabled={isLoading} />
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
                    <FormLabel>部门描述</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="请输入部门描述" disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "处理中..." : currentDepartment ? "保存" : "创建"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Departments = () => {
  const navigate = useNavigate();

  // Mock user data - 实际项目中应该从认证系统获取
  const mockUser = {
    username: '张三',
    department: '技术部',
    role: '管理员'
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 z-30">
        <Navigation
          currentPath="/system/departments"
          onMenuClick={(path) => navigate(path)}
        />
      </div>

      <div className="pl-64 min-h-screen">
        <TopBar
          username={mockUser.username}
          department={mockUser.department}
          role={mockUser.role}
          onLogout={handleLogout}
          onSearch={() => {}}
          searchQuery=""
        />
        <MainContent username={mockUser.username} currentPath="/system/departments">
          <DepartmentsManagement />
        </MainContent>
      </div>
    </div>
  );
};

export default Departments;
