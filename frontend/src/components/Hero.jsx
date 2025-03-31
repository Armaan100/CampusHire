import {Link} from "react-router-dom";
 
const Hero = () => {
    return (
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-20 sm:py-28 lg:py-36 relative overflow-hidden min-h-screen">
        {/* Subtle shine overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-30 pointer-events-none animate-shine"></div>
        
  
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo/Tagline */}
            <div className="text-3xl font-bold text-white/90 mb-2">
              Campus Hire
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mt-6 mb-8">
              Bridging <span className="text-yellow-300">Students</span> and <span className="text-yellow-300">Companies</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              The ultimate platform connecting talented students with top companies for internships and career opportunities.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/student-login" className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                For Students
              </Link>
              <Link to="/company-login" className="px-8 py-3 bg-indigo-800 text-white font-medium rounded-lg hover:bg-indigo-900 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-white/20">
                For Companies
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Hero;