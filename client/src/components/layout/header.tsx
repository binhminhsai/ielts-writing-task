import { Link, useLocation } from "wouter";
import { useState } from "react";
import { User } from "lucide-react";
import logoImage from "@assets/ChatGPT Image May 24, 2025, 09_40_14 PM.png";

export default function Header() {
  // Add this to make header accessible from all pages
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-600 text-white shadow-lg mb-2 border-b border-teal-500/30">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo/Website Name */}
        <Link href="/">
          <div className="flex items-center space-x-2">
            <img 
              src={logoImage} 
              alt="VAI Logo" 
              className="w-8 h-8 object-contain filter brightness-110"
            />
            <h1 className="text-xl font-bold cursor-pointer whitespace-nowrap bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Writing AI-Hub
            </h1>
          </div>
        </Link>
        
        {/* Spacer to push nav to right */}
        <div className="flex-grow"></div>
        
        {/* Main Navigation - Desktop */}
        <nav className="hidden lg:flex items-center mr-6">
          <div className="flex items-center space-x-1 bg-teal-800/30 rounded-xl p-1 backdrop-blur-sm">
            <Link href="/">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location === "/" ? "bg-white text-teal-700 shadow-lg transform scale-105 font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}>
                Home
              </button>
            </Link>
            <Link href="/about">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location === "/about" ? "bg-white text-teal-700 shadow-lg transform scale-105 font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}>
                About Us
              </button>
            </Link>
            <Link href="/writing-task-1">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location === "/writing-task-1" ? "bg-white text-teal-700 shadow-lg transform scale-105 font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}>
                Writing Task 1
              </button>
            </Link>
            <Link href="/writing-task-2">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location === "/writing-task-2" ? "bg-white text-teal-700 shadow-lg transform scale-105 font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}>
                Writing Task 2
              </button>
            </Link>
            {/* <Link href="/wordcraft">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location === "/wordcraft" ? "bg-white text-teal-700 shadow-lg transform scale-105 font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}>
                Vocabulary
              </button>
            </Link> */}
            <Link href="/progress">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location === "/progress" ? "bg-white text-teal-700 shadow-lg transform scale-105 font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}>
                Progress
              </button>
            </Link>
            <Link href="/wordpress-demo">
              <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${location === "/wordpress-demo" ? "bg-white text-teal-700 shadow-lg transform scale-105 font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}>
                Blog
              </button>
            </Link>
          </div>
        </nav>
        
        {/* User Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className={`bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm whitespace-nowrap ${location === "/login" ? "ring-2 ring-yellow-300 ring-offset-2 ring-offset-teal-700" : ""}`}>
              <User size={16} className="text-emerald-100" />
              <span className="hidden sm:inline">Login</span>
            </button>
          </Link>
          
          {/* Mobile Menu Toggle - Shows only on small screens */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden text-white hover:text-teal-200 ml-3"
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-teal-800 px-4 py-3 shadow-inner text-sm border-t border-teal-600/50">
          <nav className="flex flex-col space-y-2">
            <Link href="/">
              <button 
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ${location === "/" ? "bg-white text-teal-700 shadow-lg font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </button>
            </Link>
            <Link href="/about">
              <button 
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ${location === "/about" ? "bg-white text-teal-700 shadow-lg font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </button>
            </Link>
            <Link href="/writing-task-1">
              <button 
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ${location === "/writing-task-1" ? "bg-white text-teal-700 shadow-lg font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Writing Task 1
              </button>
            </Link>
            <Link href="/writing-task-2">
              <button 
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ${location === "/writing-task-2" ? "bg-white text-teal-700 shadow-lg font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Writing Task 2
              </button>
            </Link>
            <Link href="/wordcraft">
              <button 
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ${location === "/wordcraft" ? "bg-white text-teal-700 shadow-lg font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Vocabulary
              </button>
            </Link>
            <Link href="/progress">
              <button 
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ${location === "/progress" ? "bg-white text-teal-700 shadow-lg font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Progress
              </button>
            </Link>
            <Link href="/wordpress-demo">
              <button 
                className={`w-full text-left py-2.5 px-3 rounded-lg transition-all duration-300 ${location === "/wordpress-demo" ? "bg-white text-teal-700 shadow-lg font-semibold" : "text-teal-100 hover:text-white hover:bg-teal-600/50"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </button>
            </Link>
            
            {/* Authentication options for mobile */}
            <div className="pt-3 mt-2 border-t border-teal-600/50">
              <Link href="/login">
                <button 
                  className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 ${location === "/login" ? "ring-2 ring-emerald-300" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} className="text-emerald-100" />
                  Login
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}