import LoginForm from "@/components/LoginForm";
import FeatureGrid from "@/components/FeatureGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2">
            <div className="bg-blue-50/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 md:p-12">
              <LoginForm />
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <FeatureGrid />
          </div>
        </div>
        <div className="text-center text-text-light text-sm mt-12">
          @云宝宝大数据产业发展有限责任公司 版权所有
          <br />
          桂公网安备 45010302001104号ICP备17005801号-1
        </div>
      </div>
    </div>
  );
};

export default Index;