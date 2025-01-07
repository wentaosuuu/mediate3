import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const mockDepartments = [
  {
    id: '1',
    name: 'XXX科技',
    children: [
      { id: '1-1', name: '深圳总公司' },
      { id: '1-2', name: '广州分公司' },
    ],
  },
  {
    id: '2',
    name: 'YYY金融',
    children: [
      { id: '2-1', name: '北京总部' },
      { id: '2-2', name: '上海分部' },
    ],
  },
];

interface DepartmentSidebarProps {
  selectedDepartment: string;
  onDepartmentSelect: (id: string) => void;
}

export const DepartmentSidebar = ({
  selectedDepartment,
  onDepartmentSelect,
}: DepartmentSidebarProps) => {
  return (
    <div className="w-48 bg-white rounded-lg shadow-sm p-2 mr-4">
      {mockDepartments.map((dept) => (
        <div key={dept.id} className="mb-4">
          <Button
            variant="ghost"
            className="w-full justify-between font-medium"
            onClick={() => onDepartmentSelect(dept.id)}
          >
            {dept.name}
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="ml-4 space-y-1 mt-1">
            {dept.children.map((child) => (
              <Button
                key={child.id}
                variant="ghost"
                className={`w-full justify-start text-sm ${
                  selectedDepartment === child.id
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : ''
                }`}
                onClick={() => onDepartmentSelect(child.id)}
              >
                {child.name}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};