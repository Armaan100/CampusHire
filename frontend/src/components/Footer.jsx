const Footer = () => {
    return (
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Left - Campus Hire */}
          <div className="text-lg font-bold text-indigo-700">
            CampusHire
          </div>
  
          {/* Right - Made with love */}
          <div className="flex items-center space-x-1 text-gray-600">
            <span>Made with</span>
            <span className="text-pink-500">❤️</span>
            <span>by your team</span>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;