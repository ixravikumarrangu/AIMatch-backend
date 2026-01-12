import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  Building2,
  User,
  Phone,
} from "lucide-react";

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/company/company-credentials/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password_hash: formData.password,
          }),
        }
      );

      if (response.ok) {
        setIsLoading(false);
        navigate("/company/login");
      } else {
        const data = await response.json();
        alert("Registration failed: " + (data.detail || JSON.stringify(data)));
        setIsLoading(false);
      }
    } catch (err) {
      alert("Network error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 gradient-primary items-center justify-center p-12">
        <div className="max-w-lg text-primary-foreground animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Start Hiring Today
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Join thousands of companies using AIMatch to streamline their
            recruitment process.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "10K+", label: "Companies" },
              { value: "500K+", label: "Candidates" },
              { value: "95%", label: "Match Rate" },
              { value: "70%", label: "Time Saved" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-primary-foreground/10 rounded-xl p-4 text-center"
              >
                <div className="text-2xl font-display font-bold">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              AI<span className="text-gradient">Match</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Register Your Company
            </h1>
            <p className="text-muted-foreground">
              Create an account to start finding top talent
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Corporation"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contact Person
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@company.com"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary"
                required
              />
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/company/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
