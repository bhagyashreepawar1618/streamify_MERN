import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/User.context.jsx";

const Login = () => {
  const { setUser, user } = useUser();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    //api call

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("user logged in successfully..!!");

      const res = await axios.get(
        `http://localhost:8000/api/v1/users/c/${formData.username}`
      );

      console.log("response from backend is=", res.data.data);

      const userDetails = {
        fullname: res.data.data.fullname,
        avtar: res.data.data.avtar,
        coverImage: res.data.data.coverImage,
        username: res.data.data.username,
        email: res.data.data.email,
        subscribers: res.data.data.subscribersCount,
        following: res.data.data.channelsSubscribedToCount,
      };

      console.log("userdetails=", userDetails);
      setUser(userDetails);

      alert("User is logged in successfully..!!");
    } catch (error) {
      console.log("Error occured while login the user ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#1a1a1a] border border-red-900/40 backdrop-blur-lg">
        {/* Logo / Heading */}
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6 tracking-wide">
          YouTube Clone
        </h2>

        <p className="text-gray-400 text-center mb-8">Login to continue</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg bg-[#262626] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg bg-[#262626] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-300"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-red-900/50"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <span className="text-red-600 hover:underline cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
