
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserInfo } from '@/hooks/useUserInfo';

interface Department {
  id: string;
  name: string;
  description?: string;
}

interface MediationDepartmentSidebarProps {
  onDepartmentSelect?: (departmentId: string) => void;
  selectedDepartment?: string;
}

export const MediationDepartmentSidebar = ({
  onDepartmentSelect,
  selectedDepartment
}: MediationDepartmentSidebarProps) => {
  const { userInfo } = useUserInfo();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState(false);

  // 获取部门数据
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!userInfo.tenantId) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('*')
          .eq('tenant_id', userInfo.tenantId)
          .order('name');

        if (error) {
          console.error('获取部门数据失败:', error);
          return;
        }

        setDepartments(data || []);
      } catch (error) {
        console.error('获取部门数据异常:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [userInfo.tenantId]);

  const toggleDepartment = (department: string) => {
    setExpandedDepartments(prev => 
      prev.includes(department) 
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const handleDepartmentClick = (departmentId: string) => {
    if (onDepartmentSelect) {
      onDepartmentSelect(departmentId);
    }
  };

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">部门</h3>
      </div>
      <div className="p-2">
        {/* 全部选项 */}
        <div
          className={`flex items-center px-2 py-1 text-sm cursor-pointer rounded mb-1 ${
            selectedDepartment === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => handleDepartmentClick('all')}
        >
          <span className="text-gray-700">全部</span>
        </div>

        {isLoading ? (
          <div className="px-2 py-4 text-center">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-xs text-gray-500">加载中...</p>
          </div>
        ) : (
          departments.map((dept) => (
            <div key={dept.id} className="mb-1">
              <div
                className={`flex items-center px-2 py-1 text-sm cursor-pointer rounded ${
                  selectedDepartment === dept.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleDepartmentClick(dept.id)}
              >
                <span className="text-gray-700">{dept.name}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
