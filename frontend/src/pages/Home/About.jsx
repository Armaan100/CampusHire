import Footer from "../../components/Footer";
import Header from "../../components/Header";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="flex-grow flex justify-center items-center">
        <h1 className="text-xl font-bold">クールーdevだよ。</h1>
        <h3 className="text-lg">For any query or issue, email me at: <a href="https://mail.google.com/mail/?view=cm&to=gogoiarmaan5@gmail.com" target="_blank" className="text-purple-600 hover:underline ml-2">Email Me</a></h3>
      </div>
      <Footer />
    </div>
  );
};

export default About;
