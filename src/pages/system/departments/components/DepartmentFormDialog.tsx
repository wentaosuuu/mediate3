
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 部门表单验证模式
const departmentFormSchema = z.object({
  name: z.string().min(2, { message: "部门名称至少需要2个字符" }),
  description: z.string().optional(),
  tenant_id: z.string().default("default") // 设置默认值确保总是有租户ID
});

type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

interface DepartmentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DepartmentFormValues) => void;
  currentDepartment: any | null;
  isLoading: boolean;
}

const DepartmentFormDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  currentDepartment,
  isLoading
}: DepartmentFormDialogProps) => {
  
  // 表单初始化
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      name: currentDepartment?.name || "",
      description: currentDepartment?.description || "",
      tenant_id: currentDepartment?.tenant_id || "default" // 默认租户ID
    }
  });

  // 当currentDepartment改变时重置表单
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: currentDepartment?.name || "",
        description: currentDepartment?.description || "",
        tenant_id: currentDepartment?.tenant_id || "default"
      });
    }
  }, [currentDepartment, form, isOpen]);

  // 表单提交处理
  const handleSubmit = (values: DepartmentFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
  );
};

export default DepartmentFormDialog;
