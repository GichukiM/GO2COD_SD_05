import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa"; // Adding icons for GitHub and LinkedIn

function Header() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      {/* Game Logo */}
      <Link to="/" rel="noopener noreferrer" className="flex items-center space-x-2">
        <span className="text-3xl md:text-2xl font-extrabold tracking-wide text-yellow-300">
          Rock Paper Scissors
        </span>
        <span className="text-3xl md:text-2xl text-yellow-500">🎮</span> {/* Fun game controller emoji */}
      </Link>

      {/* Navigation Icons */}
      <div className="flex space-x-6 text-lg font-semibold">
        <a
          href="https://github.com/GichukiM"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-yellow-300 transition-colors text-xl md:text-2xl"
        >
          <FaGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/collins-gichuki"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-yellow-300 transition-colors text-xl md:text-2xl"
        >
          <FaLinkedin />
        </a>
      </div>
    </nav>
  );
}

export default Header;
