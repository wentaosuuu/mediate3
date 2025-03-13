
import { z } from "zod";

// 用户表单验证模式
export const userFormSchema = z.object({
  username: z.string().min(2, { message: "用户名至少需要2个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  phone: z.string().optional(),
  department_id: z.string().optional(), // 保留字段用于UI显示，但实际不会存储到users表
  role_id: z.string().optional(),
  password: z.string().min(6, { message: "密码至少需要6个字符" }).optional(),
  tenant_id: z.string()
});

export type UserFormValues = z.infer<typeof userFormSchema>;
