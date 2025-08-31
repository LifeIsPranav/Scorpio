import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

export default function Footer() {
  const openWhatsApp = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE;
    const message = "Hi! I'd like to learn more about your products.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const footerLinks = {
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "#press" },
    ],
    Support: [
      { name: "Help Center", href: "/help-center" },
      { name: "Shipping Info", href: "/shipping-info" },
      { name: "Returns", href: "/returns" },
      { name: "Size Guide", href: "/size-guide" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "Disclaimer", href: "#disclaimer" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <img 
                  src="./logo.png" 
                  alt="Scorpio Logo" 
                  className="h-8 w-8 object-contain" 
                />
                <span className="text-2xl font-bold text-primary">Scorpio</span>
              </div>

              <p className="text-muted-foreground mb-6 max-w-md">
                Your premier destination for quality products. We curate the
                finest selection and provide personalized service through direct
                WhatsApp communication.
              </p>

              <Button
                onClick={openWhatsApp}
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full mb-6"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat on WhatsApp
              </Button>

              {/* Social media */}
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Footer links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-foreground mb-4">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith("#") ? (
                        <a
                          href={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter section */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Stay Updated
              </h3>
              <p className="text-muted-foreground">
                Get notified about new products and exclusive offers.
              </p>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button className="rounded-full px-6">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Scorpio. All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with ❤️ for premium shopping</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
