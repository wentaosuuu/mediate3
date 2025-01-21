import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChartFilters } from './usage/ChartFilters';
import { UsageBarChart } from './usage/UsageBarChart';
import { generateChartData } from './usage/chartUtils';

export const UsageChart = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [selectedServices, setSelectedServices] = useState(['all']);
  const [department, setDepartment] = useState('all');
  const [staff, setStaff] = useState('all');
  const [chartData, setChartData] = useState([]);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);

  const handleServiceChange = (value: string) => {
    let newServices;
    if (value === 'all') {
      newServices = ['all'];
    } else {
      const currentServices = selectedServices.filter(s => s !== 'all');
      if (currentServices.includes(value)) {
        newServices = currentServices.filter(s => s !== value);
      } else {
        newServices = [...currentServices, value];
      }
      if (newServices.length === 0) {
        newServices = ['all'];
      }
    }
    setSelectedServices(newServices);
  };

  useEffect(() => {
    const newData = generateChartData(selectedServices, timeRange, department, staff);
    setChartData(newData);
  }, [selectedServices, timeRange, department, staff]);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-medium">额度使用统计</h3>
        <ChartFilters
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          selectedServices={selectedServices}
          handleServiceChange={handleServiceChange}
          department={department}
          setDepartment={setDepartment}
          staff={staff}
          setStaff={setStaff}
          isServiceDropdownOpen={isServiceDropdownOpen}
          setIsServiceDropdownOpen={setIsServiceDropdownOpen}
        />
      </div>
      <UsageBarChart data={chartData} />
    </Card>
  );
};