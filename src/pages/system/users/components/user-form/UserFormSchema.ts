
import { z } from "zod";

// 用户表单验证模式
export const userFormSchema = z.object({
  username: z.string().min(2, { message: "用户名至少需要2个字符" }),
  name: z.string().min(2, { message: "姓名至少需要2个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  phone: z.string().optional(),
  department_id: z.string().optional(), 
  role_id: z.string().optional(),
  password: z.string()
    .min(6, { message: "密码至少需要6个字符" })
    .optional()
    .superRefine((val, ctx) => {
      // 检查是否在编辑模式
      // 在表单上下文中获取__isEditMode标志
      // Zod的superRefine方法中，无法直接访问其他字段，所以我们使用path来检查
      const isEditMode = ctx.path.includes('__isEditMode');
      
      // 如果不是编辑模式且密码为空，则添加错误
      if (!val && !isEditMode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "创建用户时密码不能为空",
          path: ["password"]
        });
      }
    }),
  tenant_id: z.string(),
  // 添加一个隐藏字段用于标记编辑模式
  __isEditMode: z.boolean().optional().default(false)
});

export type UserFormValues = z.infer<typeof userFormSchema>;
