import { useUser } from "../contexts/User.context.jsx";
import { Link } from "react-router-dom";
const Profile = () => {
  //we've set data into user after login
  const { user } = useUser();

  //if user is not logged in
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

  //if user is looged in
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover Section */}
      <div className="relative w-full h-64 md:h-80">
        <img
          src={user.coverImage}
          alt="cover"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black"></div>

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <img
            src={user.avtar}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-red-600 object-cover shadow-xl"
          />
        </div>
      </div>

      {/* User Info Section */}
      <div className="mt-20 text-center px-4">
        <h2 className="text-3xl font-bold text-red-600">{user.fullname}</h2>

        <p className="text-gray-400 mt-2">@{user.username}</p>

        <p className="text-gray-500 mt-1">{user.email}</p>

        {/* Stats Section (optional YouTube vibe) */}
        <div className="flex justify-center gap-10 mt-8">
          <div className="text-center">
            <p className="text-xl font-semibold text-white">12</p>
            <p className="text-gray-400 text-sm">Videos</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-white">1.2K</p>
            <p className="text-gray-400 text-sm">Subscribers</p>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-white">34K</p>
            <p className="text-gray-400 text-sm">Views</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-4xl mx-auto mt-12 px-6 pb-20">
        <div className="bg-[#121212] p-8 rounded-2xl border border-red-900/40 shadow-lg">
          <h3 className="text-xl font-semibold text-red-500 mb-4">
            About Channel
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Welcome to my YouTube Clone project profile. This platform allows
            secure authentication, media uploads, and scalable backend
            architecture using modern technologies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
