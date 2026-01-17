import { useState, useEffect } from "react";
import { X, Briefcase } from "lucide-react";

const PostJob = ({ isOpen, onClose, onSubmit, companyName }) => {
  const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: companyName || companyData.company_name || "",
    location: "",
    salary: "",
    employmentType: "Full-time",
    experienceLevel: "",
    description: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    benefits: "",
  });

  // Update companyName in formData only when modal opens or companyName prop changes
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        companyName: companyName || companyData.company_name || "",
      }));
    }
  }, [companyName, isOpen]);

  const handleChange = (e) => {
    // Prevent editing companyName
    if (e.target.name === "companyName") return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare job data for backend
    const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Authentication token missing. Please login again.");
      return;
    }
    
    const payload = {
  // company: company_id, // Handled by backend via Token
  job_title: formData.jobTitle,
  location: formData.location,
  salary: formData.salary,
  employment_type: formData.employmentType,
  experience_level: formData.experienceLevel,

  job_description: formData.description,

  responsibilities: formData.responsibilities,
  requirements: formData.requirements,
  skills: formData.skills,          // comma-separated string
  benefits: formData.benefits
};

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/company/company-jobs/",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        }
      );
      if (res.ok) {
        alert("Job posted successfully!");
        onClose();
      } else {
        alert("Failed to post job.");
      }
    } catch (err) {
      alert("Error posting job.");
    }
    // Reset form (keep companyName)
    setFormData({
      jobTitle: "",
      companyName: companyData.company_name || "",
      location: "",
      salary: "",
      employmentType: "Full-time",
      experienceLevel: "",
      description: "",
      responsibilities: "",
      requirements: "",
      skills: "",
      benefits: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="glass-card rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 glass-card border-b border-border/50 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Post New Job
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill in the details to create a job posting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  readOnly
                  required
                  className="input-field w-full bg-gray-100 cursor-not-allowed"
                  placeholder="e.g., TechCorp Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g., San Francisco, CA or Remote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Salary Range *
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g., $100k - $150k"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Employment Type *
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="input-field w-full"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Experience Level *
                </label>
                <input
                  type="text"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g., 3-5 years or Mid Level"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="input-field w-full resize-none"
              placeholder="Describe the role and what the candidate will be doing..."
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Responsibilities (one per line) *
            </label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              required
              rows={5}
              className="input-field w-full resize-none"
              placeholder="Develop and maintain web applications&#10;Collaborate with design team&#10;Write clean, maintainable code"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Requirements (one per line) *
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              rows={5}
              className="input-field w-full resize-none"
              placeholder="5+ years of experience in frontend development&#10;Strong proficiency in React&#10;Experience with TypeScript"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Required Skills (comma-separated) *
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              className="input-field w-full"
              placeholder="React, TypeScript, CSS, Node.js, Git"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Benefits (one per line)
            </label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={4}
              className="input-field w-full resize-none"
              placeholder="Competitive salary&#10;Health insurance&#10;Flexible work hours&#10;Remote work options"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
