import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-[#0f0f0f] border-b border-red-900/40 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-red-600 tracking-wide">
          YouTube Clone
        </h1>

        {/* Navigation */}
        <nav className="flex gap-6 text-gray-300 font-medium">
          <Link to="/" className="hover:text-red-600 transition duration-300">
            Home
          </Link>

          <Link
            to="/login"
            className="hover:text-red-600 transition duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="hover:text-red-600 transition duration-300"
          >
            Register
          </Link>

          <Link
            to="/profile"
            className="hover:text-red-600 transition duration-300"
          >
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
