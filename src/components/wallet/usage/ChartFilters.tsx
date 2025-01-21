import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// 时间范围选项
const timeRanges = [
  { value: 'today', label: '本日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'lastMonth', label: '上月' },
  { value: 'custom', label: '自定义' },
];

// 服务类型选项
const serviceTypes = [
  { value: 'all', label: '全部服务' },
  { value: 'sms', label: '短信服务' },
  { value: 'mms', label: '彩信服务' },
  { value: 'voice', label: '外呼服务' },
  { value: 'h5_system', label: 'H5案件公示系统' },
  { value: 'seat', label: '坐席服务' },
  { value: 'number_auth', label: '号码认证' },
];

// 部门选项
const departments = [
  { value: 'all', label: '全部部门' },
  { value: 'sales', label: '销售部' },
  { value: 'service', label: '客服部' },
  { value: 'operation', label: '运营部' },
];

// 员工选项
const staffMembers = [
  { value: 'all', label: '全部作业员' },
  { value: 'staff1', label: '张三' },
  { value: 'staff2', label: '李四' },
  { value: 'staff3', label: '王五' },
];

interface ChartFiltersProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  selectedServices: string[];
  handleServiceChange: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  staff: string;
  setStaff: (value: string) => void;
  isServiceDropdownOpen: boolean;
  setIsServiceDropdownOpen: (value: boolean) => void;
}

export const ChartFilters: React.FC<ChartFiltersProps> = ({
  timeRange,
  setTimeRange,
  selectedServices,
  handleServiceChange,
  department,
  setDepartment,
  staff,
  setStaff,
  isServiceDropdownOpen,
  setIsServiceDropdownOpen,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-[140px] bg-white">
          <SelectValue placeholder="选择时间范围" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {timeRanges.map((range) => (
            <SelectItem key={range.value} value={range.value}>
              {range.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative">
        <Select 
          value={selectedServices[0]} 
          open={isServiceDropdownOpen}
          onOpenChange={(open) => {
            // 只在点击触发器时切换下拉框状态
            if (!open) {
              setIsServiceDropdownOpen(false);
            }
          }}
        >
          <SelectTrigger 
            className="w-[160px] bg-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsServiceDropdownOpen(!isServiceDropdownOpen);
            }}
          >
            <SelectValue placeholder="选择服务类型" />
          </SelectTrigger>
          <SelectContent 
            className="bg-white"
          >
            {serviceTypes.map((service) => (
              <div
                key={service.value}
                className="flex items-center px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleServiceChange(service.value);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.value)}
                  onChange={() => {}}
                  className="h-4 w-4 mr-2"
                />
                {service.label}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="w-[140px] bg-white">
          <SelectValue placeholder="部门" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {departments.map((dept) => (
            <SelectItem key={dept.value} value={dept.value}>
              {dept.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={staff} onValueChange={setStaff}>
        <SelectTrigger className="w-[140px] bg-white">
          <SelectValue placeholder="作业员" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {staffMembers.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};