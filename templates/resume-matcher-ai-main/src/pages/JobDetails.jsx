import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  CheckCircle2,
  Award,
} from "lucide-react";

// This will eventually come from your backend/database
const dummyJobDetails = {
  1: {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    companyName: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    postedDate: "2024-01-10",
    description:
      "We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for building and maintaining high-quality web applications using modern frameworks and technologies.",
    responsibilities: [
      "Develop and maintain responsive web applications using React and TypeScript",
      "Collaborate with designers and backend developers to implement features",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and mentor junior developers",
      "Optimize application performance and ensure cross-browser compatibility",
    ],
    requirements: [
      "5+ years of experience in frontend development",
      "Strong proficiency in React, JavaScript/TypeScript, and CSS",
      "Experience with state management (Redux, Context API)",
      "Familiarity with RESTful APIs and modern build tools",
      "Excellent problem-solving and communication skills",
    ],
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "CSS/SASS",
      "Redux",
      "Git",
      "Webpack",
      "REST API",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "Flexible work hours and remote options",
      "Professional development budget",
      "Gym membership and wellness programs",
    ],
    companyDescription:
      "TechCorp Inc. is a leading technology company focused on building innovative solutions for businesses worldwide. We pride ourselves on our collaborative culture and commitment to excellence.",
  },
  2: {
    id: 2,
    jobTitle: "Full Stack Engineer",
    companyName: "StartupXYZ",
    location: "Remote",
    salary: "$100k - $140k",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    postedDate: "2024-01-08",
    description:
      "Join our fast-growing startup as a Full Stack Engineer. You'll work on cutting-edge projects and have the opportunity to shape our technology stack.",
    responsibilities: [
      "Build scalable web applications from front-end to back-end",
      "Design and implement RESTful APIs",
      "Work with databases and optimize queries",
      "Deploy and monitor applications in cloud environments",
      "Collaborate with product team to define features",
    ],
    requirements: [
      "3+ years of full stack development experience",
      "Proficiency in JavaScript/Node.js and a modern framework (React, Vue, or Angular)",
      "Experience with SQL and NoSQL databases",
      "Knowledge of cloud platforms (AWS, GCP, or Azure)",
      "Strong understanding of software development best practices",
    ],
    skills: [
      "Node.js",
      "React",
      "MongoDB",
      "PostgreSQL",
      "AWS",
      "Docker",
      "Express",
      "GraphQL",
    ],
    benefits: [
      "Stock options in a growing startup",
      "100% remote work flexibility",
      "Unlimited PTO policy",
      "Learning and development stipend",
      "Latest tech equipment provided",
    ],
    companyDescription:
      "StartupXYZ is revolutionizing the way businesses operate with our SaaS platform. We're a team of passionate builders creating the future of work.",
  },
};

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobDetails, setJobDetails] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // In a real app, fetch job details from your backend
    const job = dummyJobDetails[jobId];
    if (job) {
      setJobDetails(job);
      // Check if user has already applied
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const appliedJobs = userData.appliedJobs || [];
      setHasApplied(appliedJobs.includes(parseInt(jobId)));
    }
  }, [jobId]);

  const handleApply = async () => {
    setIsApplying(true);

    setTimeout(() => {
      // Save application
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const appliedJobs = userData.appliedJobs || [];
      appliedJobs.push(parseInt(jobId));
      userData.appliedJobs = appliedJobs;
      localStorage.setItem("userData", JSON.stringify(userData));

      setHasApplied(true);
      setIsApplying(false);

      alert("Application submitted successfully!");
    }, 1000);
  };

  if (!jobDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Job not found</p>
          <button
            onClick={() => navigate("/user/dashboard")}
            className="btn-primary mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                AI<span className="text-gradient">Match</span>
              </span>
            </Link>
            <button
              onClick={() => navigate("/user/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="glass-card rounded-xl p-8 mb-6 animate-slide-up">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl gradient-accent flex items-center justify-center text-foreground font-semibold text-2xl">
                {jobDetails.companyName.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  {jobDetails.jobTitle}
                </h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {jobDetails.companyName}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{jobDetails.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm">{jobDetails.salary}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">{jobDetails.employmentType}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Posted {new Date(jobDetails.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleApply}
            disabled={hasApplied || isApplying}
            className={`btn-primary w-full md:w-auto ${
              hasApplied ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isApplying ? (
              "Submitting..."
            ) : hasApplied ? (
              <>
                <CheckCircle2 className="w-5 h-5 inline mr-2" />
                Already Applied
              </>
            ) : (
              "Apply for this position"
            )}
          </button>
        </div>

        <div className="glass-card rounded-xl p-8 mb-6 animate-slide-up delay-100">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            About the Role
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {jobDetails.description}
          </p>
        </div>

        <div className="glass-card rounded-xl p-8 mb-6 animate-slide-up delay-200">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Responsibilities
          </h2>
          <ul className="space-y-3">
            {jobDetails.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-xl p-8 mb-6 animate-slide-up delay-300">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Requirements
          </h2>
          <ul className="space-y-3">
            {jobDetails.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-3">
                <Award className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-xl p-8 mb-6 animate-slide-up delay-400">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {jobDetails.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-8 mb-6 animate-slide-up delay-500">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            Benefits
          </h2>
          <ul className="space-y-3">
            {jobDetails.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-xl p-8 mb-20 md:mb-6 animate-slide-up delay-600">
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">
            About {jobDetails.companyName}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {jobDetails.companyDescription}
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 glass-card border-t border-border/50 md:hidden">
          <button
            onClick={handleApply}
            disabled={hasApplied || isApplying}
            className={`btn-primary w-full ${
              hasApplied ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isApplying ? (
              "Submitting..."
            ) : hasApplied ? (
              <>
                <CheckCircle2 className="w-5 h-5 inline mr-2" />
                Already Applied
              </>
            ) : (
              "Apply for this position"
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
