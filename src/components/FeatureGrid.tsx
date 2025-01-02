import { MessageCircle, Smartphone, PhoneCall, Mail, FileText, Bell, Users, BookOpen, Star } from "lucide-react";
import { useState, useEffect } from "react";

const features = [
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "短信触达",
    description: "智能短信服务，提高触达效率",
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "闪信截屏",
    description: "高效便捷的信息传递方式",
  },
  {
    icon: <PhoneCall className="w-8 h-8" />,
    title: "挂短短信",
    description: "智能化通话后续服务",
  },
  {
    icon: <Mail className="w-8 h-8" />,
    title: "呼叫中心",
    description: "专业的呼叫服务中心",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "智能案件管理",
    description: "高效的案件管理系统",
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: "通知调解函",
    description: "便捷的调解通知服务",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "调解文书在线签署",
    description: "在线文书签署服务",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "案件公示",
    description: "透明的案件公示系统",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "调解作业培训",
    description: "专业的调解培训服务",
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "专属客服服务",
    description: "贴心的客户服务支持",
  },
];

const FeatureGrid = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // 自动切换动画效果
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setActiveIndex(currentIndex);
      currentIndex = (currentIndex + 1) % features.length;
      
      // 重置动画
      setTimeout(() => {
        setActiveIndex(null);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
        开始体验司法调解云平台
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
              activeIndex === index ? 'scale-110' : ''
            }`}
          >
            <div className="text-primary mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-text-primary mb-2">{feature.title}</h3>
            <p className="text-text-secondary text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;