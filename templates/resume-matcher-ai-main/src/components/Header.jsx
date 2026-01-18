import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Briefcase, Users, Info, Mail, Sparkles } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [userAuth, setUserAuth] = useState(null);
  const [companyAuth, setCompanyAuth] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData") || "null");
    const company = JSON.parse(localStorage.getItem("companyData") || "null");
    if (user) setUserAuth(user);
    if (company) setCompanyAuth(company);
  }, []);

  const getNavLinks = () => {
    const commonLinks = [
      { to: "/", label: "Home", icon: Briefcase },
      { to: "/about", label: "About", icon: Info },
      { to: "/contact", label: "Contact", icon: Mail },
    ];

    if (companyAuth) {
      return [
        ...commonLinks,
        { to: "/company/dashboard", label: "Dashboard", icon: Briefcase },
      ];
    }
    if (userAuth) {
      return [
        ...commonLinks,
        { to: "/user/dashboard", label: "Dashboard", icon: Users },
      ];
    }

    return [
      { to: "/", label: "Home", icon: Briefcase },
      { to: "/company/login", label: "Company", icon: Briefcase },
      { to: "/user/login", label: "Users", icon: Users },
      { to: "/about", label: "About", icon: Info },
      { to: "/contact", label: "Contact", icon: Mail },
    ];
  };

  const navLinks = getNavLinks();
  const logoLink = companyAuth
    ? "/company/dashboard"
    : userAuth
    ? "/user/dashboard"
    : "/";

  const ctaLink = companyAuth
    ? "/company/dashboard"
    : userAuth
    ? "/user/dashboard"
    : "/company/login";
  
  const ctaText = (companyAuth || userAuth) ? "Dashboard" : "Get Started";

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to={logoLink} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              AI<span className="text-gradient">Match</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link flex items-center gap-2 ${
                  isActive(link.to) ? "nav-link-active" : ""
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link to={ctaLink} className="btn-primary">
              {ctaText}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <Link
                to={ctaLink}
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary mt-2 text-center"
              >
                {ctaText}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
