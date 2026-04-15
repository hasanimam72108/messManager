import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-24 py-20 min-h-[calc(100vh-80px)] font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] bg-green-200/40 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-blue-100/40 rounded-full blur-[80px] -z-10"></div>

      <div className="md:w-1/2 md:pr-12 lg:pr-24 space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm shadow-sm ring-1 ring-green-200/50">
          <Sparkles className="w-4 h-4" />
          <span>The #1 Mess Management Platform in BD</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
          Manage Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            Mess Costs
          </span>
          <br className="hidden md:block" />
          Smartly
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
          Say goodbye to messy calculations. Automated meal tracking,
          transparent expense management, and accurate monthly billing for
          university students.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
          <Link
            to="/register"
            className="group bg-green-600 text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center shadow-lg shadow-green-600/25 hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Start for Free
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-8 border border-gray-200 rounded-full text-center shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-1"
          >
            Explore Features
          </a>
        </div>

        {/* Simple Trust indicators */}
        <div className="pt-8 flex items-center gap-6 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Free setup
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Quick
            calculating
          </div>
        </div>
      </div>

      <div className="md:w-1/2 mt-16 md:mt-0 relative z-10 w-full flex justify-center">
        {/* Decorative Ring around Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl transform rotate-3 scale-[1.02] opacity-20 blur-lg transition-transform duration-700 hover:rotate-6"></div>
        <img
          src="https://cdn.bdnews24.com/bdnews24/media/bdnews24-english/import/media/2017/06/05/bangladesh-cricket-at-red-fort-21.jpg"
          alt="Students eating"
          className="relative rounded-2xl shadow-2xl w-full h-auto object-cover max-h-[550px] border-4 border-white/80 backdrop-blur-sm z-20 hover:scale-[1.01] transition-transform duration-500"
        />

        {/* Floating Card snippet (Decorative) */}
        <div
          className="hidden lg:flex absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl z-30 items-center gap-4 border border-gray-100 animate-bounce"
          style={{ animationDuration: "4s" }}
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
            ৳
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Saved</p>
            <p className="text-xl font-bold text-gray-800">12,450 ৳</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
