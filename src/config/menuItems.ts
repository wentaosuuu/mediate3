import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  MessageSquare,
  Wallet,
  PieChart
} from 'lucide-react';
import { MenuItem } from '@/types/navigation';

export const menuItems: MenuItem[] = [
  {
    label: '首页',
    path: '/dashboard',
    icon: LayoutDashboard
  },
  {
    label: '案件管理',
    path: '/dashboard/case',
    icon: FileSpreadsheet,
    children: [
      {
        label: '案件分配',
        path: '/dashboard/case/distribution'
      }
    ]
  },
  {
    label: '调解管理',
    path: '/dashboard/mediation',
    icon: MessageSquare,
    children: [
      {
        label: '短信服务',
        path: '/dashboard/mediation/sms'
      },
      {
        label: '短信记录',
        path: '/dashboard/mediation/sms-records'
      }
    ]
  },
  {
    label: '钱包管理',
    path: '/dashboard/wallet',
    icon: Wallet,
    children: [
      {
        label: '账户余额',
        path: '/dashboard/wallet/balance'
      },
      {
        label: '充值订单',
        path: '/dashboard/wallet/orders'
      },
      {
        label: '充值购买',
        path: '/dashboard/wallet/purchase'
      },
      {
        label: '额度查询',
        path: '/dashboard/wallet/quota'
      }
    ]
  },
  {
    label: '额度管理',
    path: '/dashboard/quota',
    icon: PieChart,
    children: [
      {
        label: '部门额度分配',
        path: '/dashboard/quota/department'
      }
    ]
  }
];