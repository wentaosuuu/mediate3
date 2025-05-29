
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export const MediationDepartmentSidebar = () => {
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>(['xxx科技']);

  const toggleDepartment = (department: string) => {
    setExpandedDepartments(prev => 
      prev.includes(department) 
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  };

  const departments = [
    {
      name: 'xxx科技',
      children: [
        { name: 'eerz' },
        { name: 'adds' }
      ]
    },
    {
      name: '深圳总公司',
      children: [
        { name: '研发部门' },
        { name: '市场部门' },
        { name: '测试部门' },
        { name: '财务部门' },
        { name: '法律部门' }
      ]
    },
    {
      name: '长沙分公司',
      children: [
        { name: '市场部门' },
        { name: '财务部门' }
      ]
    }
  ];

  return (
    <div className="h-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">部门</h3>
      </div>
      <div className="p-2">
        {departments.map((dept) => (
          <div key={dept.name} className="mb-1">
            <div
              className="flex items-center px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => toggleDepartment(dept.name)}
            >
              {expandedDepartments.includes(dept.name) ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )}
              <span className="text-gray-700">{dept.name}</span>
            </div>
            {expandedDepartments.includes(dept.name) && (
              <div className="ml-5 mt-1">
                {dept.children.map((child) => (
                  <div
                    key={child.name}
                    className="px-2 py-1 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 rounded"
                  >
                    {child.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
