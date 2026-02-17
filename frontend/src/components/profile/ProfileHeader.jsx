import { Link } from "react-router-dom";

function ProfileHeader() {
  return (
    <>
      <header className="bg-[#0f0f0f] border-b border-red-900/40 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-xl font-bold text-red-600 tracking-wide">
            Profile Section
          </h1>

          {/* Navigation */}
          <nav className="flex gap-6 text-gray-300 font-small">
            <Link to="" className="hover:text-red-600 transition duration-300">
              My Profile
            </Link>

            <Link
              to="update-profile"
              className="hover:text-red-600 transition duration-300"
            >
              update Profile
            </Link>

            <Link
              to="watch-history"
              className="hover:text-red-600 transition duration-300"
            >
              Watch History
            </Link>

            <Link
              to="change-password"
              className="hover:text-red-600 transition duration-300"
            >
              change Password
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export default ProfileHeader;
