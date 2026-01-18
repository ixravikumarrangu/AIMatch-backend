import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  Globe,
  Save,
  Briefcase,
} from "lucide-react";

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    description: "",
    benefits: "",
    culture: "",
  });

  useEffect(() => {
    // Load company data from localStorage
    const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");
    let email = companyData.email || "";
    if (!email && formData.email) email = formData.email;
    if (!email) return;
    // Fetch company_id from credentials table using email
    fetch(
      `http://127.0.0.1:8000/api/company/company-credentials/?email=${encodeURIComponent(
        email
      )}`
    )
      .then((res) => res.json())
      .then((credData) => {
        if (Array.isArray(credData) && credData.length > 0) {
          const company_id = credData[0].company_id;
          localStorage.setItem(
            "companyData",
            JSON.stringify({ ...companyData, company_id, email })
          );
          // Fetch company profile using company_id
          fetch(
            `http://127.0.0.1:8000/api/company/company-profiles/${company_id}`
          )
            .then((res) => {
              if (!res.ok) throw new Error("No profile");
              return res.json();
            })
            .then((profile) => {
              setFormData({
                companyName: profile.company_name || "",
                email: profile.email || "",
                phone: profile.phone || "",
                address: profile.address || "",
                website: profile.website || "",
                industry: profile.industry || "",
                companySize: profile.company_size || "",
                foundedYear: profile.founded_year || "",
                description: profile.description || "",
                benefits: profile.benefits || "",
                culture: profile.culture || "",
              });
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [formData.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");
    // If company_id not found, fetch it using email
    let company_id = companyData.company_id;
    if (!company_id && formData.email) {
      const credRes = await fetch(
        `http://127.0.0.1:8000/api/company/company-credentials/?email=${encodeURIComponent(
          formData.email
        )}`
      );
      const credData = await credRes.json();
      if (Array.isArray(credData) && credData.length > 0) {
        company_id = credData[0].company_id;
        localStorage.setItem(
          "companyData",
          JSON.stringify({ ...companyData, company_id, email: formData.email })
        );
      }
    }
    if (!company_id) {
      alert(
        "Company ID not found. Please check your email or register your company."
      );
      setIsSaving(false);
      return;
    }
    // Prepare payload for backend
    const payload = {
      company: company_id,
      company_name: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      website: formData.website,
      industry: formData.industry,
      company_size: formData.companySize,
      founded_year: formData.foundedYear,
      description: formData.description,
      benefits: formData.benefits,
      culture: formData.culture,
    };
    // Try to update, if fails, create
    let method = "PUT";
    let url = `http://127.0.0.1:8000/api/company/company-profiles/${companyData.company_id}/`;
    let res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      // Try POST if not found
      method = "POST";
      url = "http://127.0.0.1:8000/api/company/company-profiles/";
      res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setIsSaving(false);
    if (res.ok) {
      alert("Company profile updated successfully!");
      navigate("/company/dashboard");
    } else {
      alert("Failed to update company profile.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/company/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                AI<span className="text-gradient">Match</span>
              </span>
            </Link>
            <button
              onClick={() => navigate("/company/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Company Profile
          </h1>
          <p className="text-muted-foreground">
            Update your company information and attract top talent
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="glass-card rounded-xl p-8 animate-slide-up delay-100">
            <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Company Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g., TechCorp Inc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field w-full pl-12"
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field w-full pl-12"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Headquarters Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field w-full pl-12"
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input-field w-full pl-12"
                    placeholder="https://www.company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="input-field w-full"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    className="input-field w-full"
                    placeholder="e.g., 2015"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="glass-card rounded-xl p-8 animate-slide-up delay-200">
            <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Company Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="input-field w-full resize-none"
                  placeholder="Describe your company, mission, and what makes you unique..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Employee Benefits (one per line)
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={4}
                  className="input-field w-full resize-none"
                  placeholder="Health insurance&#10;401(k) matching&#10;Remote work options&#10;Professional development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Culture
                </label>
                <textarea
                  name="culture"
                  value={formData.culture}
                  onChange={handleChange}
                  rows={4}
                  className="input-field w-full resize-none"
                  placeholder="Describe your company culture, values, and work environment..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 animate-slide-up delay-300">
            <button
              type="button"
              onClick={() => navigate("/company/dashboard")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>

        {/* Profile Preview */}
        {formData.companyName && (
          <div className="glass-card rounded-xl p-8 mt-6 animate-slide-up delay-400">
            <h2 className="text-xl font-display font-bold text-foreground mb-4">
              Company Preview
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl gradient-accent flex items-center justify-center text-foreground font-semibold text-2xl">
                {formData.companyName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {formData.companyName}
                </h3>
                {formData.industry && (
                  <p className="text-sm text-muted-foreground">
                    {formData.industry}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  {formData.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {formData.address}
                    </span>
                  )}
                  {formData.companySize && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {formData.companySize} employees
                    </span>
                  )}
                  {formData.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </a>
                    </span>
                  )}
                </div>
                {formData.description && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                    {formData.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyProfile;
