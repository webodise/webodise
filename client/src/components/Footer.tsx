import { Link } from "react-router-dom";
import { GraduationCap, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src="/nlogo.png" alt="Jyoti Public School Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg">Jyoti Public School</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Nurturing young minds with quality education, discipline, and values since establishment. Building the leaders of tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm opacity-70">
              <Link to="/about" className="hover:opacity-100 transition-opacity">About Us</Link>
              <Link to="/academics" className="hover:opacity-100 transition-opacity">Academics</Link>
              <Link to="/admissions" className="hover:opacity-100 transition-opacity">Admissions</Link>
              <Link to="/gallery" className="hover:opacity-100 transition-opacity">Gallery</Link>
              <Link to="/contact" className="hover:opacity-100 transition-opacity">Contact Us</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="flex flex-col gap-3 text-sm opacity-70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Kahra Ward No. 6/41, Saharsa, Bihar – 852201</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:8229095143" className="hover:opacity-100 transition-opacity">8229095143</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <a href="mailto:jyotipublicschool24@gmail.com" className="hover:opacity-100 transition-opacity">jyotipublicschool24@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">School Hours</h4>
            <div className="text-sm opacity-70 space-y-2">
              <p>Monday – Saturday</p>
              <p className="font-medium opacity-100">8:00 AM – 2:00 PM</p>
              <p className="mt-4">Office Hours</p>
              <p className="font-medium opacity-100">9:00 AM – 4:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm opacity-60 space-y-2">
          <p>
            © {new Date().getFullYear()} Jyoti Public School, Saharsa. All rights reserved.
          </p>

          <p>
            Designed & Developed by{" "}
            <a
              href="http://www.webodise.website"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:opacity-100 transition-opacity"
            >
              Webodise
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;


