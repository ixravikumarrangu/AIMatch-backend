import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  LogOut,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Search,
  Plus,
  ChevronRight,
  Users,
  Clock,
} from "lucide-react";
import PostJob from "./PostJob";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [companyProfile, setCompanyProfile] = useState({
    company_name: "",
    description: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

  useEffect(() => {
    // Fetch jobs for this company and their applicants
    let companyData;
    try {
      companyData = JSON.parse(localStorage.getItem("companyData") || "{}");
    } catch (e) {
      companyData = {};
    }
    const company_id = companyData && companyData.company_id;
    if (!company_id) {
      setJobs([]);
      window.__DASHBOARD_ERROR =
        "Missing company_id in localStorage. Please login again.";
      return;
    }
    fetch(
      `http://127.0.0.1:8000/api/company/company-jobs/?company=${company_id}`
    )
      .then((res) => (res.ok ? res.json() : []))
      // .then(async (jobList) => {
      //   // For each job, fetch applicants
      //   const jobsWithApplicants = await Promise.all(
      //     jobList.map(async (job) => {
      //       const res = await fetch(
      //         `http://127.0.0.1:8000/api/company/job-applicants/?job=${job.id}`
      //       );
      //       const applicants = res.ok ? await res.json() : [];
      //       return { ...job, applicants };
      //     })
      //   );
      //   setJobs(jobsWithApplicants);
      // })
      .then(async (jobList) => {
  const normalizedJobs = await Promise.all(
    jobList.map(async (job) => {
      const res = await fetch(
        `http://127.0.0.1:8000/api/company/job-applicants/?job=${job.job_id}`
      );
      const applicants = res.ok ? await res.json() : [];

      return {
        id: job.job_id,
        jobTitle: job.job_title,
        companyName: companyData.company_name || "Company",
        location: job.location,
        salary: job.salary,
        postedDate: job.created_at,
        skills: typeof job.skills === "string"
          ? job.skills.split(",").map(s => s.trim())
          : [],
        applicants
      };
    })
  );

  setJobs(normalizedJobs);
})

      .catch((err) => {
        setJobs([]);
        window.__DASHBOARD_ERROR = "Error fetching jobs: " + err;
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("companyAuth");
    localStorage.removeItem("companyData");
    navigate("/");
  };
  const CompanyProfile = () => {
    navigate("/CompanyProfile");
  };
  const handlePostJob = () => {
    // After posting, refetch jobs from backend
    const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");
    const company_id = companyData.company_id;
    if (company_id) {
      fetch(
        `http://127.0.0.1:8000/api/company/company-jobs/?company=${company_id}`
      )
        .then((res) => (res.ok ? res.json() : []))
        .then((jobList) => {
          setJobs(jobList);
        });
    }
    setIsPostJobOpen(false);
  };

  const handleJobClick = (jobId) => {
    navigate(`/company-dashboard/job/${jobId}`);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      (job.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );
  const activeJobs = jobs.length;
  const shortlistedCount = jobs.reduce(
    (sum, job) =>
      sum +
      (job.applicants?.filter((a) => a.status === "shortlisted").length || 0),
    0
  );

  const stats = [
    {
      label: "Active Jobs",
      value: activeJobs,
      icon: Briefcase,
      color: "primary",
    },
    {
      label: "Total Applicants",
      value: totalApplicants,
      icon: Users,
      color: "accent",
    },
    {
      label: "Shortlisted",
      value: shortlistedCount,
      icon: Users,
      color: "success",
    },
    {
      label: "This Month",
      value: jobs.filter((j) => {
        const jobDate = j.postedDate ? new Date(j.postedDate) : null;
        const now = new Date();
        return (
          jobDate.getMonth() === now.getMonth() &&
          jobDate.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: Calendar,
      color: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                Company Dashboard
              </span>
              <button
                onClick={CompanyProfile}
                className="flex items-center gap-2 px-4 text-sm font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Company Info Section */}
        {companyProfile.company_name && (
          <div className="mb-6 animate-slide-up">
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">
              {companyProfile.company_name}
            </h2>
            {companyProfile.description && (
              <p className="text-muted-foreground mb-2">
                {companyProfile.description}
              </p>
            )}
          </div>
        )}

        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8 animate-slide-up">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Your Job Postings 👋
            </h1>
            <p className="text-muted-foreground">
              Manage your job listings and view applicants
            </p>
          </div>
          <button
            onClick={() => setIsPostJobOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`card-interactive p-6 animate-slide-up delay-${
                (index + 1) * 100
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center mb-4`}
              >
                <stat.icon className={`w-6 h-6 text-${stat.color}`} />
              </div>
              <div className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="glass-card rounded-xl p-4 mb-6 animate-slide-up delay-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 w-full"
            />
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                className={`card-interactive p-6 cursor-pointer animate-slide-up delay-${Math.min(
                  (index + 4) * 100,
                  500
                )}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Job Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center text-foreground font-semibold text-lg">
                      {job.companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-lg">
                        {job.jobTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {job.companyName}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Applicants & Skills */}
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(job.skills) ? job.skills : []).slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-display font-bold text-foreground">
                          {job.applicants?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Applicants
                        </p>
                      </div>

                      <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card rounded-xl">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {jobs.length === 0
                ? "You haven't posted any jobs yet"
                : "No jobs found matching your search"}
            </p>
            {jobs.length === 0 && (
              <button
                onClick={() => setIsPostJobOpen(true)}
                className="btn-primary"
              >
                Post Your First Job
              </button>
            )}
          </div>
        )}
      </main>

      {/* Post Job Modal */}
      <PostJob
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onSubmit={handlePostJob}
        companyName={companyProfile.company_name}
      />
    </div>
  );
};

export default CompanyDashboard;
