import React, { useState } from "react";
import logo from "/Logo/Landing/Storify4.png";
import { Link } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const scroll = (value) => {
    window.scrollTo({
      top: value,
      behavior: "smooth",
    });
    closeMenu(); // Mobile menu close on click
  };

  return (
    <nav className="bg-gray-900 py-3 px-6 flex justify-between items-center w-10/12 mx-auto rounded-3xl absolute z-50 top-2 md:top-6 left-[50%] translate-x-[-50%]">
      <Link to={"/"} className="flex items-center justify-center">
        <img src={logo} alt="Logo" width={50} className="mr-4 relative z-10" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-6 text-white">
        <ul className="flex space-x-6">
          <li onClick={() => scroll(4000)}>
            <a href="#" className="hover:text-gray-400">
              Pricing
            </a>
          </li>
          <li>
            <Link to={"/login"} className="hover:text-gray-400">
              Sign in
            </Link>
          </li>
        </ul>
        <Link
          to={"/login"}
          className="bg-white text-black px-4 py-2 rounded-full font-semibold"
        >
          Claim 500 MB for free
        </Link>
      </div>

      {/* Hamburger Menu for Mobile */}
      <div className="lg:hidden">
        <button className="text-white focus:outline-none" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-12 left-0 right-0 bg-gray-800 p-6 rounded-b-xl z-50 shadow-lg">
          <ul className="flex flex-col items-center space-y-4 text-white">
            <li>
              <a href="#" className="hover:text-gray-400" onClick={() => scroll(4000)}>
                Pricing
              </a>
            </li>
            <li>
              <Link to={"/login"} className="hover:text-gray-400" onClick={closeMenu}>
                Sign in
              </Link>
            </li>
          </ul>
          <Link
            to={"/login"}
            onClick={closeMenu}
            className="block text-center w-full mt-4 bg-white text-black px-4 py-2 rounded-full font-semibold"
          >
            Claim 500 MB for free
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
