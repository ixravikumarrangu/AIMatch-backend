import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  LogOut,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

import { useEffect } from "react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  // Fetch jobs and applications from backend
  useEffect(() => {
    // Get user email from localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.email) return;
    // Fetch user_id
    fetch(
      `http://127.0.0.1:8000/api/user/user-credentials/?email=${encodeURIComponent(
        userData.email
      )}`
    )
      .then((res) => res.json())
      .then((credData) => {
        if (Array.isArray(credData) && credData.length > 0) {
          const userId = credData[0].user_id;
          // Fetch applications
          fetch(
            `http://127.0.0.1:8000/api/user/user-applications/?user=${userId}`
          )
            .then((res) => res.json())
            .then((apps) => setApplications(apps));
        }
      });
    // Fetch jobs
    fetch(`http://127.0.0.1:8000/api/company/company-jobs/`)
      .then((res) => res.json())
      .then((jobs) => setJobs(jobs));
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    // Get user email from localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.email) {
      alert("User not logged in");
      return;
    }
    // Fetch user_id
    let userId = null;
    try {
      const credRes = await fetch(
        `http://127.0.0.1:8000/api/user/user-credentials/?email=${encodeURIComponent(
          userData.email
        )}`
      );
      const credData = await credRes.json();
      if (Array.isArray(credData) && credData.length > 0) {
        userId = credData[0].user_id;
      }
    } catch (err) {
      alert("Failed to fetch user ID");
      return;
    }
    if (!userId) {
      alert("User ID not found");
      return;
    }
    // Upload file to backend
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("user_id", userId);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/upload_resume/", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Resume uploaded and extracted successfully!");
      } else {
        const data = await res.json();
        alert("Resume upload failed: " + (data.error || JSON.stringify(data)));
      }
    } catch (err) {
      alert("Network error during resume upload");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("userData");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/Profile");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "applied":
        return <AlertCircle className="w-5 h-5 text-primary" />;
      case "shortlisted":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { class: "status-applied", label: "Applied" },
      shortlisted: { class: "status-shortlisted", label: "Shortlisted" },
      rejected: { class: "status-rejected", label: "Rejected" },
    };
    return statusConfig[status] || statusConfig.applied;
  };

  const getAtsScoreClass = (score) => {
    if (score >= 80) return "ats-high";
    if (score >= 60) return "ats-medium";
    return "ats-low";
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: Briefcase,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Shortlisted",
      value: applications.filter((a) => a.status === "shortlisted").length,
      icon: CheckCircle2,
      color: "bg-success/10 text-success",
    },
    {
      label: "Under Review",
      value: applications.filter((a) => a.status === "applied").length,
      icon: Clock,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Avg Match Score",
      value:
        Math.round(
          applications.reduce((sum, a) => sum + a.atsScore, 0) /
            applications.length
        ) + "%",
      icon: TrendingUp,
      color: "bg-accent/10 text-accent",
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
                Job Seeker Dashboard
              </span>
              <button
                className="flex items-center font-bold glass-card md:inline"
                onClick={handleProfile}
              >
                {" "}
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
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Your Applications
          </h1>
          <p className="text-muted-foreground">
            Track and manage all your job applications in one place
          </p>
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
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Profile Tip */}
        <div className="glass-card rounded-xl p-6 mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 animate-slide-up delay-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Optimize Your Profile
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload your resume to get AI-powered suggestions and improve
                your ATS score for better job matches.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              className="btn-primary ml-auto flex md:flex"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Resume
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="glass-card rounded-xl p-4 mb-6 animate-slide-up delay-400">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">All Applications</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <div
              key={application.id}
              className={`card-interactive p-6 animate-slide-up delay-${Math.min(
                (index + 5) * 100,
                500
              )}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Company Logo & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center text-foreground font-semibold text-lg">
                    {application.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">
                      {application.jobTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {application.companyName}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {application.location}
                      </span>
                      <span>{application.salary}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Status */}
                  <div className="flex items-center gap-3">
                    {getStatusIcon(application.status)}
                    <div>
                      <span
                        className={`status-badge ${
                          getStatusBadge(application.status).class
                        }`}
                      >
                        {getStatusBadge(application.status).label}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applied{" "}
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* View Details */}
                  <button
                    onClick={() => navigate(`/job/${application.id}`)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No applications found matching your criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
