
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
      // 从上下文中获取表单的当前状态
      const formData = ctx.path.length > 0 ? ctx : undefined;
      
      // 检查是否在编辑模式（有currentUser）
      // 我们使用表单中传递的外部上下文信息，但在zod的RefinementCtx中无法直接访问它
      // 因此我们需要从UserFormDialog组件中传递一个额外的标志
      const isEditMode = ctx.data?.__isEditMode === true;
      
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
