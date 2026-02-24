import axios from "axios";
import { useState } from "react";
import { useUser } from "../../contexts/User.context.jsx";

const Login = () => {
  const { setUser } = useUser();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // ✅ loading state added
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // ✅ start loading

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/login`,
        {
          username: formData.username,
          password: formData.password,
        }
      );

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/c/${formData.username}`
      );

      const userDetails = {
        fullname: res.data.data.fullname,
        avtar: res.data.data.avtar,
        coverImage: res.data.data.coverImage,
        username: res.data.data.username,
        email: res.data.data.email,
        subscribers: res.data.data.subscribersCount,
        following: res.data.data.channelsSubscribedToCount,
      };

      setUser(userDetails);
      console.log("accesss token is=", response.data.data.accessToken);
      localStorage.setItem("accessToken", response.data.data.accessToken);

      alert("User is logged in successfully..!!");
    } catch (error) {
      console.log("Error occured while login the user ", error);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[#1a1a1a] border border-red-900/40 backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6 tracking-wide">
          YouTube Clone
        </h2>

        <p className="text-gray-400 text-center mb-8">Login to continue</p>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* ✅ Only Button Styling Updated */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-800 disabled:bg-red-900 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-red-900/50 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="w-5 h-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register">
            <span className="text-red-600 hover:underline cursor-pointer">
              Register
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
