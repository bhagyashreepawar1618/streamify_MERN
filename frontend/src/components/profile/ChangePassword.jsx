import { useState } from "react";
import { useUser } from "../../contexts/User.context";
import { Link } from "react-router-dom";
const ChangePassword = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    console.log("Old Password:", formData.oldPassword);
    console.log("New Password:", formData.newPassword);

    //backend api call here
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="bg-[#121212] border border-red-900/40 rounded-2xl p-10 text-center shadow-xl max-w-md w-full">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>

          <p className="text-gray-400 mb-6">
            Please login first to view your profile.
          </p>

          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-red-700 hover:bg-red-800 transition rounded-lg font-semibold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-[#121212] border border-red-900/40 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-gray-400 mb-2">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              required
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-400 mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-400 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:ring-2 focus:ring-red-600 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-red-700 hover:bg-red-800 transition rounded-lg font-semibold text-lg"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
