import SearchBar from "./SearchBar";
import { Menu, MessageCircle, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="./logo.png" 
              alt="Scorpio Logo" 
              className="h-9 object-contain" 
            />
            <span className="text-xl font-bold text-primary">Scorpio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:block">
              <SearchBar
                placeholder="Search..."
                className="w-64"
              />
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium"
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 rounded-full"
                  title="Contact Us"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </Link>
              {/* Mobile search button */}
              <div className="lg:hidden">
                <Link to="/search">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 rounded-full"
                    title="Search"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <SearchBar
                  placeholder="Search..."
                  className="w-full"
                />
              </div>
              
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/contact"
                className="block px-3 py-2 text-foreground/70 hover:text-foreground transition-colors duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
