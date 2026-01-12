import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock, ArrowRight, Building2 } from "lucide-react";

const CompanyLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/company/company-credentials/?email=" +
          encodeURIComponent(formData.email),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          alert("Invalid email or password");
          setIsLoading(false);
          return;
        }
        // Find the company row with exact email match (case-insensitive)
        const company = data.find(
          (row) =>
            row.email &&
            row.email.toLowerCase() === formData.email.toLowerCase()
        );
        if (company && company.password_hash === formData.password) {
          localStorage.setItem("companyAuth", "true");
          localStorage.setItem(
            "companyData",
            JSON.stringify({ email: formData.email })
          );
          setIsLoading(false);
          navigate("/company/dashboard");
        } else {
          alert("Invalid email or password");
          setIsLoading(false);
        }
      } else {
        alert("Login failed");
        setIsLoading(false);
      }
    } catch (err) {
      alert("Network error");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
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
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your company account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="company@example.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>
              <Link to="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/company/register"
              className="text-primary font-medium hover:underline"
            >
              Register your company
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 gradient-primary items-center justify-center p-12">
        <div className="max-w-lg text-primary-foreground animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-8">
            <Building2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Hire Smarter with AI
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Access our powerful AI-driven recruitment tools to find the perfect
            candidates for your team.
          </p>
          <div className="space-y-4">
            {[
              "AI-powered resume screening",
              "Instant ATS score generation",
              "Smart candidate shortlisting",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
