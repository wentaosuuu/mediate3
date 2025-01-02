import RegisterForm from "@/components/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <RegisterForm />
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

export default Register;