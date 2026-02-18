const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] border-t border-red-900/40 py-6 ">
      <div className="text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} YouTube Clone. Built with ❤️ in Dark Mode.
      </div>
    </footer>
  );
};

export default Footer;
