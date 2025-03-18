
import { departmentAssociationModule } from '../useDepartmentAssociation';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// 模拟依赖
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn()
  }
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    loading: jest.fn()
  }
}));

jest.mock("@/utils/logger", () => {
  return {
    Logger: jest.fn().mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }))
  };
});

describe('departmentAssociationModule', () => {
  const userId = 'test-user-id';
  const departmentId = 'test-department-id';
  const toastId = 'test-toast-id';
  
  beforeEach(() => {
    // 清除所有模拟状态
    jest.clearAllMocks();
  });
  
  it('应当在userId为空时返回错误', async () => {
    const result = await departmentAssociationModule.handle('', departmentId, toastId);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.message).toBe('用户ID不能为空');
    expect(toast.error).toHaveBeenCalled();
  });
  
  it('应当处理检查现有关联失败的情况', async () => {
    const checkError = new Error('检查失败');
    (supabase.from('user_departments').select().eq().maybeSingle as jest.Mock).mockResolvedValue({
      data: null,
      error: checkError
    });
    
    const result = await departmentAssociationModule.handle(userId, departmentId, toastId);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(checkError);
    expect(toast.error).toHaveBeenCalled();
  });
  
  it('应当创建新的部门关联', async () => {
    // 模拟无现有关联
    (supabase.from('user_departments').select().eq().maybeSingle as jest.Mock).mockResolvedValue({
      data: null,
      error: null
    });
    
    // 模拟插入成功
    (supabase.from('user_departments').insert as jest.Mock).mockResolvedValue({
      error: null
    });
    
    const result = await departmentAssociationModule.handle(userId, departmentId, toastId);
    
    expect(result.success).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('user_departments');
    expect(supabase.from('user_departments').insert).toHaveBeenCalledWith({
      user_id: userId,
      department_id: departmentId
    });
  });
  
  it('应当更新现有部门关联', async () => {
    const existingDeptId = 'existing-dept-association-id';
    
    // 模拟有现有关联
    (supabase.from('user_departments').select().eq().maybeSingle as jest.Mock).mockResolvedValue({
      data: { id: existingDeptId, department_id: 'old-dept-id' },
      error: null
    });
    
    // 模拟更新成功
    (supabase.from('user_departments').update as jest.Mock).mockReturnThis();
    (supabase.from('user_departments').update().eq().eq as jest.Mock).mockResolvedValue({
      error: null
    });
    
    const result = await departmentAssociationModule.handle(userId, departmentId, toastId);
    
    expect(result.success).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('user_departments');
    expect(supabase.from('user_departments').update).toHaveBeenCalledWith({
      department_id: departmentId
    });
  });
  
  it('应当删除部门关联当departmentId为null时', async () => {
    const existingDeptId = 'existing-dept-association-id';
    
    // 模拟有现有关联
    (supabase.from('user_departments').select().eq().maybeSingle as jest.Mock).mockResolvedValue({
      data: { id: existingDeptId, department_id: 'old-dept-id' },
      error: null
    });
    
    // 模拟删除成功
    (supabase.from('user_departments').delete as jest.Mock).mockReturnThis();
    (supabase.from('user_departments').delete().eq().eq as jest.Mock).mockResolvedValue({
      error: null
    });
    
    const result = await departmentAssociationModule.handle(userId, null, toastId);
    
    expect(result.success).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('user_departments');
    expect(supabase.from('user_departments').delete).toHaveBeenCalled();
  });
  
  it('应当处理意外错误', async () => {
    const unexpectedError = new Error('意外错误');
    
    // 模拟抛出意外错误
    (supabase.from('user_departments').select().eq().maybeSingle as jest.Mock).mockRejectedValue(unexpectedError);
    
    const result = await departmentAssociationModule.handle(userId, departmentId, toastId);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(unexpectedError);
    expect(toast.error).toHaveBeenCalled();
  });
});
