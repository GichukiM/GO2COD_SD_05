import { Link } from "react-router-dom"

function Header() {
    return (
        <nav className="flex justify-between items-center px-4 py-2 bg-gray-800 text-white">
      <Link to="/" rel="noopener noreferrer">
      <h1 className="text-xl font-bold">Rock Paper Scissors</h1>
      </Link>
      <div className="flex space-x-4">
        <a
          href="https://github.com/yourusername"
          target="_blank"
          className="hover:underline"
        >
          GitHub
        </a>
        <a
          href="https://yourportfolio.com"
          target="_blank"
          className="hover:underline"
        >
          Portfolio
        </a>
      </div>
    </nav>
    )
}

export default Header