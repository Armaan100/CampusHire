import Footer from "../../components/Footer";
import Header from "../../components/Header";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-grow flex justify-center items-center">
        <h1 className="text-xl font-bold">クールーdevだよ。</h1>
      </div>
      <Footer />
    </div>
  );
};

export default About;
