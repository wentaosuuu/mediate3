
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  FilePlus, 
  MessageSquare, 
  BarChart2,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WelcomeContent = () => {
  const navigate = useNavigate();

  interface QuickLinkProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    color: string;
  }

  const QuickLink = ({ title, description, icon, path, color }: QuickLinkProps) => (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate(path)}
      >
        访问
      </Button>
    </div>
  );

  const quickLinks = [
    {
      title: "用户管理",
      description: "创建和管理系统用户，分配权限和部门。",
      icon: <Users className="text-white" />,
      path: "/system/users",
      color: "bg-blue-500"
    },
    {
      title: "角色管理",
      description: "创建和管理系统角色，设置权限。",
      icon: <ShieldCheck className="text-white" />,
      path: "/system/roles",
      color: "bg-purple-500"
    },
    {
      title: "部门管理",
      description: "创建和管理公司部门结构。",
      icon: <Building2 className="text-white" />,
      path: "/system/departments",
      color: "bg-green-500"
    },
    {
      title: "案件管理",
      description: "查看和管理法调案件，分案处理。",
      icon: <FilePlus className="text-white" />,
      path: "/case/distribution",
      color: "bg-orange-500"
    },
    {
      title: "短信服务",
      description: "发送短信通知，管理短信模板。",
      icon: <MessageSquare className="text-white" />,
      path: "/mediation/sms",
      color: "bg-indigo-500"
    },
    {
      title: "额度统计",
      description: "查看和分析额度使用情况。",
      icon: <BarChart2 className="text-white" />,
      path: "/quota/statistics",
      color: "bg-rose-500"
    },
    {
      title: "钱包余额",
      description: "查看钱包余额，充值额度。",
      icon: <Wallet className="text-white" />,
      path: "/wallet/balance",
      color: "bg-amber-500"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">欢迎使用法调云平台</h1>
        <p className="text-gray-600">
          选择以下任一功能模块开始使用，或通过左侧菜单导航访问更多功能。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {quickLinks.map((link, index) => (
          <QuickLink
            key={index}
            title={link.title}
            description={link.description}
            icon={link.icon}
            path={link.path}
            color={link.color}
          />
        ))}
      </div>
    </div>
  );
};
