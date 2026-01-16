import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png'; 

export const Navigation = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 w-full bg-black text-white z-50 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={logo} alt="Premium Sands Logo" className="h-10 w-auto" />
          <span className="font-bold text-xl tracking-tight hidden sm:block text-primary"></span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
          <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
          <a href="#why" className="text-sm font-medium hover:text-primary transition-colors">Why Us</a>
          <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
        </div>

        <button
          className="md:hidden p-2 text-white hover:text-primary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-black border-t border-gray-800 absolute w-full left-0 top-16 flex flex-col p-4 gap-4 shadow-xl">
          <a 
            href="#home" 
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Home
          </a>
          <a 
            href="#about" 
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            About
          </a>
          <a 
            href="#why" 
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Why Us
          </a>
          <a 
            href="#contact" 
            className="text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setOpen(false)}
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};
