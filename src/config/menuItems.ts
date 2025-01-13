import {
  Home,
  FileText,
  MessageSquare,
  BarChart2,
  MessageCircle,
  PhoneCall,
  BookOpen,
  LineChart,
  Building2,
  UserCircle,
  Settings,
  Globe,
} from 'lucide-react';
import { MenuItem } from '@/types/navigation';

export const menuItems: MenuItem[] = [
  { 
    icon: Home, 
    label: "首页", 
    path: "/dashboard"
  },
  { 
    icon: FileText, 
    label: "案件管理", 
    path: "/case",
    children: [
      { label: "分案管理", path: "/case/distribution" }
    ]
  },
  { 
    icon: MessageSquare, 
    label: "调解管理", 
    path: "/mediation",
    children: [
      { label: "调解中心", path: "/mediation/center" },
      { label: "债务人管理", path: "/mediation/debtor" },
      { label: "案件公示信息", path: "/mediation/case-info" },
      { label: "案件公示信息管理", path: "/mediation/case-info-manage" },
      { label: "短信触达服务", path: "/mediation/sms-service" }
    ]
  },
  { 
    icon: BarChart2, 
    label: "仪表盘", 
    path: "/dashboard-stats",
    children: [
      { label: "短信数据看板", path: "/dashboard-stats/sms" },
      { label: "通信数据看板", path: "/dashboard-stats/communication" }
    ]
  },
  { 
    icon: MessageCircle, 
    label: "短信管理", 
    path: "/sms",
    children: [
      { label: "短信类型配置", path: "/sms/type-config" },
      { label: "短信模板配置", path: "/sms/template-config" }
    ]
  },
  { 
    icon: PhoneCall, 
    label: "呼叫中心", 
    path: "/call-center",
    children: [
      { label: "主叫管理", path: "/call-center/caller" },
      { label: "坐席管理", path: "/call-center/seat" },
      { label: "工号坐席管理", path: "/call-center/work-number-seat" },
      { label: "工号管理", path: "/call-center/work-number" },
      { label: "信修虚拟号管理", path: "/call-center/virtual-number" },
      { label: "信修坐席管理", path: "/call-center/credit-seat" }
    ]
  },
  { 
    icon: BookOpen, 
    label: "调解记录", 
    path: "/mediation-records",
    children: [
      { label: "修复批次", path: "/mediation-records/repair-batch" },
      { label: "信修通话记录", path: "/mediation-records/credit-call" },
      { label: "修复记录", path: "/mediation-records/repair" },
      { label: "通话记录", path: "/mediation-records/call" },
      { label: "短信批次", path: "/mediation-records/sms-batch" },
      { label: "短信记录", path: "/mediation-records/sms" }
    ]
  },
  { 
    icon: LineChart, 
    label: "运营中心", 
    path: "/operation",
    children: [
      { label: "隐私设置", path: "/operation/privacy" },
      { label: "短信触达批次", path: "/operation/sms-reach" }
    ]
  },
  { 
    icon: Building2, 
    label: "租户管理", 
    path: "/tenant",
    children: [
      { label: "租户管理", path: "/tenant/manage" },
      { label: "租户套餐管理", path: "/tenant/package" }
    ]
  },
  { 
    icon: UserCircle, 
    label: "账户中心", 
    path: "/account",
    children: [
      { label: "账户管理", path: "/account/manage" },
      { label: "账户消费总表", path: "/account/consumption" },
      { label: "充值记录", path: "/account/recharge" }
    ]
  },
  { 
    icon: Settings, 
    label: "系统管理", 
    path: "/system",
    children: [
      { label: "用户管理", path: "/system/users" },
      { label: "角色管理", path: "/system/roles" },
      { label: "菜单管理", path: "/system/menus" },
      { label: "部门管理", path: "/system/departments" },
      { label: "岗位管理", path: "/system/positions" },
      { label: "字典管理", path: "/system/dictionaries" },
      { label: "参数设置", path: "/system/parameters" },
      { label: "通知公告", path: "/system/notifications" },
      { label: "日志管理", path: "/system/logs" },
      { label: "文件管理", path: "/system/files" },
      { label: "客户端管理", path: "/system/clients" }
    ]
  },
  { 
    icon: Globe, 
    label: "全局管理", 
    path: "/global"
  }
];
