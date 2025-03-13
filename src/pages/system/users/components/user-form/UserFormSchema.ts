
import { z } from "zod";

// 用户表单验证模式
export const userFormSchema = z.object({
  username: z.string().min(2, { message: "用户名至少需要2个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  phone: z.string().optional(),
  department_id: z.string().optional(), 
  role_id: z.string().optional(),
  password: z.string()
    .min(6, { message: "密码至少需要6个字符" })
    .optional()
    // 创建用户时需要密码，编辑时不需要
    .refine(val => val !== undefined && val !== "", {
      message: "创建用户时密码不能为空",
      // 这个路径将用于显示错误信息
      path: ["password"]
    }),
  tenant_id: z.string()
});

export type UserFormValues = z.infer<typeof userFormSchema>;
