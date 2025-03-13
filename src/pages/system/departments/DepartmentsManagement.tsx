
import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DepartmentsTable from './components/DepartmentsTable';
import DepartmentFormDialog from './components/DepartmentFormDialog';

// 部门管理组件
const DepartmentsManagement = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<any>(null);
  const { toast } = useToast();

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
  const handleSubmit = async (values: any) => {
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
    setIsDialogOpen(true);
  };

  // 打开编辑部门对话框
  const openEditDialog = (department: any) => {
    setCurrentDepartment(department);
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

      <DepartmentsTable 
        departments={filteredDepartments}
        isLoading={isLoading}
        onEdit={openEditDialog}
        onDelete={deleteDepartment}
      />

      <DepartmentFormDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        currentDepartment={currentDepartment}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DepartmentsManagement;
