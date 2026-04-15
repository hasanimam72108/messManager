import { CalendarSync, FileCheck, UserPlus } from "lucide-react";

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 px-8 bg-white font-sans text-center"
    >
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          How MessManager Works
        </h2>
        <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
          Simplifying mess management in three easy steps. No more keeping
          complex diaries or arguing over calculations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-8 max-w-5xl mx-auto">
        {/* Step 1 */}
        <div className="flex-[1] flex flex-col items-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center relative mb-6">
            <UserPlus className="w-10 h-10 text-green-600" />
            <div className="absolute -top-2 -right-2 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-4 border-white">
              1
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">
            Create & Invite
          </h3>
          <p className="text-gray-500 font-medium">
            Set up your mess profile in minutes and invite all your mess members
            to join the digital space.
          </p>
        </div>

        {/* Separator */}
        <div className="hidden md:block flex-[0.5] h-0.5 bg-gradient-to-r from-green-100 to-green-500 rounded-full"></div>

        {/* Step 2 */}
        <div className="flex-[1] flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center relative mb-6">
            <CalendarSync className="w-10 h-10 text-blue-600" />
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-4 border-white">
              2
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Track Daily</h3>
          <p className="text-gray-500 font-medium">
            Members input their daily meals. The manager adds bazaar & utility
            expenses as they happen.
          </p>
        </div>

        {/* Separator */}
        <div className="hidden md:block flex-[0.5] h-0.5 bg-gradient-to-r from-blue-100 to-green-500 rounded-full"></div>

        {/* Step 3 */}
        <div className="flex-[1] flex flex-col items-center">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center relative mb-6">
            <FileCheck className="w-10 h-10 text-purple-600" />
            <div className="absolute -top-2 -right-2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-4 border-white">
              3
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Get Reports</h3>
          <p className="text-gray-500 font-medium">
            At month end, instantly get individual bills, meal rates, and total
            sums with zero manual math.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
