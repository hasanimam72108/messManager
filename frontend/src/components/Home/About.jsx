import { CheckCircle2, FileText, Utensils, WalletCards } from "lucide-react";

const About = () => {
  return (
    <section
      id="features"
      className="py-24 px-8 bg-gray-50/50 font-sans text-center relative"
    >
      <div className="absolute inset-0 bg-white/40 mask-image-vertical"></div>

      <div className="relative z-10 max-w-2xl mx-auto mb-16">
        <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-4 border border-green-200">
          Supercharge Your Mess
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Everything You Need to Manage Your Mess
        </h2>
        <p className="text-lg text-gray-600 font-medium">
          Say hello to stress-free mess administration. No more paper ledgers or
          confusing group chats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
        {/* Feature 1 */}
        <div className="group bg-white text-left p-10 rounded-2xl shadow-sm border border-gray-100/60 hover:shadow-2xl hover:border-green-100 hover:-translate-y-2 transition-all duration-300">
          <div className="bg-gradient-to-br from-green-100 to-green-50 text-green-600 w-16 h-16 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
            <Utensils className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Automated Meal Tracking
          </h3>
          <p className="text-gray-500 leading-relaxed mb-6 font-medium">
            Easily track your daily meals with a seamless interface. Record
            breakfast, lunch, and dinner with just a few clicks. No more
            disputes.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Daily
              Meal Check-in
            </li>
            <li className="flex items-center text-sm text-gray-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" /> Real-time
              tracking
            </li>
          </ul>
        </div>

        {/* Feature 2 */}
        <div className="group bg-white text-left p-10 rounded-2xl shadow-sm border border-gray-100/60 hover:shadow-2xl hover:border-green-100 hover:-translate-y-2 transition-all duration-300">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 w-16 h-16 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
            <WalletCards className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Transparent Expenses
          </h3>
          <p className="text-gray-500 leading-relaxed mb-6 font-medium">
            Keep track of all mess expenses including daily bazaar, gas,
            electricity, and other costs. Transparent, organized, and visible to
            everyone.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" />{" "}
              Categorized Expenses
            </li>
            <li className="flex items-center text-sm text-gray-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mr-2" /> Manager
              Controls
            </li>
          </ul>
        </div>

        {/* Feature 3 */}
        <div className="group bg-white text-left p-10 rounded-2xl shadow-sm border border-gray-100/60 hover:shadow-2xl hover:border-green-100 hover:-translate-y-2 transition-all duration-300">
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 w-16 h-16 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            Detailed Reporting
          </h3>
          <p className="text-gray-500 leading-relaxed mb-6 font-medium">
            Get comprehensive monthly reports with automatic bill calculation
            based on your meal count. Ensures 100% fair and accurate billing.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-purple-500 mr-2" /> PDF
              Export
            </li>
            <li className="flex items-center text-sm text-gray-600 font-medium">
              <CheckCircle2 className="w-4 h-4 text-purple-500 mr-2" /> Due &
              Balance Tracking
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
