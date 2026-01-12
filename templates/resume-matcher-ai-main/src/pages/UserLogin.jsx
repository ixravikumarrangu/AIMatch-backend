import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  User,
  Briefcase,
} from "lucide-react";
import sha256 from "crypto-js/sha256";

const UserLogin = () => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/user-credentials/?email=" +
          encodeURIComponent(loginData.email),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          alert("Invalid email or password 2");
          setIsLoading(false);
          return;
        }
        // If email exists, check password
        if (data[0].password_hash === sha256(loginData.password).toString()) {
          localStorage.setItem("userAuth", "true");
          localStorage.setItem(
            "userData",
            JSON.stringify({ email: loginData.email })
          );
          setIsLoading(false);
          navigate("/user/dashboard");
        } else {
          alert("Invalid email or password 1");
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/user-credentials/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: registerData.email,
            password_hash: sha256(registerData.password).toString(),
          }),
        }
      );

      if (response.ok) {
        setIsLoading(false);
        setIsFlipped(false);
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
      <div className="hidden lg:flex w-1/2 gradient-accent items-center justify-center p-12">
        <div className="max-w-lg text-foreground animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-foreground/10 flex items-center justify-center mb-8">
            <Briefcase className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Find Your Dream Job
          </h2>
          <p className="text-lg text-foreground/80 mb-8">
            Let AI match your skills with the perfect opportunities. Stand out
            with our smart ATS-optimized profile.
          </p>
          <div className="space-y-4">
            {[
              "AI-powered job matching",
              "ATS score optimization",
              "Track your applications",
              "Get interview ready",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Flip Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md perspective-1000">
          <div
          // className={`relative w-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          // style={{
          //   transformStyle: 'preserve-3d',
          //   transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          // }}
          >
            {/* Login Form - Front */}
            <div
              className="w-full animate-slide-up"
              style={{
                backfaceVisibility: "hidden",
                display: isFlipped ? "none" : "block",
              }}
            >
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-foreground">
                  AI<span className="text-gradient">Match</span>
                </span>
              </Link>

              <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground">
                  Sign in to your job seeker account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="you@example.com"
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
                      value={loginData.password}
                      onChange={handleLoginChange}
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

              <p className="mt-8 text-center text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => setIsFlipped(true)}
                  className="text-primary font-medium hover:underline"
                >
                  Create account
                </button>
              </p>
            </div>

            {/* Register Form - Back */}
            <div
              className="w-full animate-slide-up"
              style={{
                backfaceVisibility: "hidden",
                display: isFlipped ? "block" : "none",
              }}
            >
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-foreground">
                  AI<span className="text-gradient">Match</span>
                </span>
              </Link>

              <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  Create Account
                </h1>
                <p className="text-muted-foreground">
                  Start your job search journey
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      placeholder="John Doe"
                      className="input-field pl-12"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="you@example.com"
                      className="input-field pl-12"
                      required
                    />
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
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className="input-field pl-12"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className="input-field pl-12"
                        required
                      />
                    </div>
                  </div>
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
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setIsFlipped(false)}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
