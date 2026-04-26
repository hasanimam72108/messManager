import { ChefHat } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { requestMess } from "../../mock/mockBackend";

const Register = () => {
  const [formData, setFormData] = useState({
    messName: "",
    managerName: "",
    managerEmail: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      requestMess(formData);
      toast.success("Mess request sent to super admin.");
      setFormData({ messName: "", managerName: "", managerEmail: "" });
    } catch (error) {
      toast.error(error.message || "Request failed.");
    }
  };

  return (
    <div className="text-center w-full">
      {/* <!-- Title --> */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="bg-green-600 p-2.5 rounded-2xl flex items-center justify-center">
          <ChefHat className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800">
          Mess<span className="text-green-600">Manager</span>
        </h1>
      </div>
      <p className="text-gray-500 mt-2 mb-8">Manager mess creation request</p>

      {/* <!-- Card --> */}
      <div className="bg-white shadow-xl border border-gray-200 w-105 mx-auto p-8 rounded-xl text-left">
        <h2 className="text-xl font-semibold">Create Mess Request</h2>
        <p className="text-gray-500 text-sm mb-4">
          Submit mess details for super admin approval
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Mess Name</label>
            <input
              type="text"
              name="messName"
              value={formData.messName}
              onChange={handleChange}
              placeholder="Enter mess name"
              className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Manager Name (Optional)</label>
            <input
              type="text"
              name="managerName"
              value={formData.managerName}
              onChange={handleChange}
              placeholder="Enter manager name"
              className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1">Manager Email</label>
            <input
              type="email"
              name="managerEmail"
              value={formData.managerEmail}
              onChange={handleChange}
              placeholder="manager.email@example.com"
              className="w-full bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mt-2"
          >
            Create Mess
          </button>

          <p className="text-center text-sm mt-3">
            Already approved?
            <Link
              to="/login"
              className="text-green-600 font-medium hover:underline ml-1"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
