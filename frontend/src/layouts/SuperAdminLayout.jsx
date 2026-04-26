import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/SuperAdmin/Sidebar/Sidebar";

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0 transition duration-200 ease-in-out`}
      >
        <Sidebar onClose={toggleSidebar} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-[20px] font-bold text-green-700">Super Admin</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
