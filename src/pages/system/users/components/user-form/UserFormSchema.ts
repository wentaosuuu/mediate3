
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
    .refine((val) => {
      // 这里简化refine参数，不使用ctx参数，在后面的验证中添加上下文判断
      return true;
    }, {
      message: "创建用户时密码不能为空"
    })
    .superRefine((val, ctx) => {
      // 使用superRefine进行更复杂的验证，根据是否存在currentUser决定密码是否必填
      if (!val && !ctx.path.includes("password") && !ctx.data.currentUser) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "创建用户时密码不能为空",
          path: ["password"]
        });
      }
    }),
  tenant_id: z.string()
});

export type UserFormValues = z.infer<typeof userFormSchema>;
