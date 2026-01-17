// import { useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import {
//   Sparkles,
//   ArrowLeft,
//   Users,
//   Search,
//   Filter,
//   FileText,
//   Clock,
//   UserCheck,
//   Calendar,
//   TrendingUp,
// } from "lucide-react";

// const JobApplicants = () => {
//   const { jobId } = useParams();
//   const navigate = useNavigate();

//   // Fetch job details and applicants from backend
//   const [jobData, setJobData] = useState(null);
//   const [applicants, setApplicants] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   useEffect(() => {
//     // Fetch job details
//     fetch(`http://127.0.0.1:8000/api/company/company-jobs/${jobId}/`)
//       .then((res) => (res.ok ? res.json() : null))
//       .then((job) => setJobData(job));
//     // Fetch applicants for this job
//     fetch(`http://127.0.0.1:8000/api/company/job-applicants/?job=${jobId}`)
//       .then((res) => (res.ok ? res.json() : []))
//       .then((data) => setApplicants(data));
//   }, [jobId]);

//   if (!jobData) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-muted-foreground mb-4">Job not found</p>
//           <button
//             onClick={() => navigate("/company-dashboard")}
//             className="btn-primary"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const updateApplicantStatus = async (applicantId, newStatus) => {
//     // PATCH applicant status in backend
//     const res = await fetch(
//       `http://127.0.0.1:8000/api/company/job-applicants/${applicantId}/`,
//       {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       }
//     );
//     if (res.ok) {
//       // Refresh applicants
//       fetch(`http://127.0.0.1:8000/api/company/job-applicants/?job=${jobId}`)
//         .then((r) => (r.ok ? r.json() : []))
//         .then((data) => setApplicants(data));
//     } else {
//       alert("Failed to update applicant status");
//     }
//   };

//   const getAtsScoreClass = (score) => {
//     if (score >= 80) return "ats-high";
//     if (score >= 60) return "ats-medium";
//     return "ats-low";
//   };

//   const getStatusBadge = (status) => {
//     const statusClasses = {
//       new: "bg-primary/10 text-primary",
//       shortlisted: "bg-success/10 text-success",
//       interview: "bg-warning/10 text-warning",
//       rejected: "bg-destructive/10 text-destructive",
//     };
//     return statusClasses[status] || statusClasses.new;
//   };

//   // applicants from backend

//   const filteredApplicants = applicants.filter((app) => {
//     const matchesSearch =
//       app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterStatus === "all" || app.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   const stats = [
//     {
//       label: "Total Applicants",
//       value: applicants.length,
//       icon: Users,
//       color: "primary",
//     },
//     {
//       label: "Shortlisted",
//       value: applicants.filter((a) => a.status === "shortlisted").length,
//       icon: UserCheck,
//       color: "success",
//     },
//     {
//       label: "Interviews",
//       value: applicants.filter((a) => a.status === "interview").length,
//       icon: Calendar,
//       color: "warning",
//     },
//     {
//       label: "Avg ATS Score",
//       value: applicants.length
//         ? Math.round(
//             applicants.reduce((sum, a) => sum + a.atsScore, 0) /
//               applicants.length
//           )
//         : 0,
//       icon: TrendingUp,
//       color: "accent",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 z-50 glass-card border-b border-border/50">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <Link to="/" className="flex items-center gap-2">
//               <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
//                 <Sparkles className="w-5 h-5 text-primary-foreground" />
//               </div>
//               <span className="text-xl font-display font-bold text-foreground">
//                 AI<span className="text-gradient">Match</span>
//               </span>
//             </Link>

//             <button
//               onClick={() => navigate("/company-dashboard")}
//               className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Jobs
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         {/* Job Header */}
//         <div className="glass-card rounded-xl p-6 mb-6 animate-slide-up">
//           <div className="flex items-start gap-4 mb-4">
//             <div className="w-16 h-16 rounded-xl gradient-accent flex items-center justify-center text-foreground font-semibold text-2xl">
//               {jobData.companyName.charAt(0)}
//             </div>
//             <div className="flex-1">
//               <h1 className="text-2xl font-display font-bold text-foreground mb-1">
//                 {jobData.jobTitle}
//               </h1>
//               <p className="text-muted-foreground">{jobData.companyName}</p>
//               <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
//                 <span>📍 {jobData.location}</span>
//                 <span>💰 {jobData.salary}</span>
//                 <span>
//                   📅 Posted {new Date(jobData.postedDate).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           {stats.map((stat, index) => (
//             <div
//               key={stat.label}
//               className={`card-interactive p-6 animate-slide-up delay-${
//                 (index + 1) * 100
//               }`}
//             >
//               <div
//                 className={`w-12 h-12 rounded-xl bg-${stat.color}/10 flex items-center justify-center mb-4`}
//               >
//                 <stat.icon className={`w-6 h-6 text-${stat.color}`} />
//               </div>
//               <div className="text-2xl font-display font-bold text-foreground">
//                 {stat.value}
//               </div>
//               <div className="text-sm text-muted-foreground">{stat.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Filters & Search */}
//         <div className="glass-card rounded-xl p-4 mb-6 animate-slide-up delay-300">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search applicants..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="input-field pl-12 w-full"
//               />
//             </div>
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="input-field"
//             >
//               <option value="all">All Status</option>
//               <option value="new">New</option>
//               <option value="shortlisted">Shortlisted</option>
//               <option value="interview">Interview</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//         </div>

//         {/* Applicants List */}
//         {filteredApplicants.length > 0 ? (
//           <div className="space-y-4">
//             {filteredApplicants.map((applicant, index) => (
//               <div
//                 key={applicant.id}
//                 className={`card-interactive p-6 animate-slide-up delay-${Math.min(
//                   (index + 4) * 100,
//                   500
//                 )}`}
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//                   {/* Avatar & Basic Info */}
//                   <div className="flex items-center gap-4 flex-1">
//                     <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
//                       {applicant.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </div>
//                     <div>
//                       <h3 className="font-display font-semibold text-foreground">
//                         {applicant.name}
//                       </h3>
//                       <p className="text-sm text-muted-foreground">
//                         {applicant.email}
//                       </p>
//                       <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
//                         <Clock className="w-3 h-3" />
//                         Applied{" "}
//                         {new Date(applicant.appliedDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Skills */}
//                   <div className="flex-1">
//                     <div className="flex flex-wrap gap-2">
//                       {applicant.skills?.map((skill) => (
//                         <span
//                           key={skill}
//                           className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   {/* ATS Score & Actions */}
//                   <div className="flex items-center gap-6">
//                     <div className="text-center">
//                       <div
//                         className={`ats-score ${getAtsScoreClass(
//                           applicant.atsScore
//                         )}`}
//                       >
//                         {applicant.atsScore}
//                       </div>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         ATS Score
//                       </p>
//                     </div>

//                     <div className="text-center">
//                       <span
//                         className={`status-badge capitalize ${getStatusBadge(
//                           applicant.status
//                         )}`}
//                       >
//                         {applicant.status}
//                       </span>
//                     </div>

//                     <div className="flex gap-2">
//                       {applicant.status !== "shortlisted" &&
//                         applicant.status !== "rejected" && (
//                           <button
//                             onClick={() =>
//                               updateApplicantStatus(applicant.id, "shortlisted")
//                             }
//                             className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
//                             title="Shortlist"
//                           >
//                             <UserCheck className="w-5 h-5" />
//                           </button>
//                         )}
//                       {applicant.status !== "interview" &&
//                         applicant.status !== "rejected" && (
//                           <button
//                             onClick={() =>
//                               updateApplicantStatus(applicant.id, "interview")
//                             }
//                             className="p-2 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
//                             title="Schedule Interview"
//                           >
//                             <Calendar className="w-5 h-5" />
//                           </button>
//                         )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
//             <p className="text-muted-foreground">
//               {applicants.length === 0
//                 ? "No applicants yet for this position"
//                 : "No applicants found matching your criteria"}
//             </p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default JobApplicants;
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  Users,
  Clock,
  UserCheck,
  Calendar,
  TrendingUp,
} from "lucide-react";

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH JOB + APPLICANTS ================= */
  useEffect(() => {
    fetchJobAndApplicants();
  }, [jobId]);

  const fetchJobAndApplicants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      /* -------- Fetch job details -------- */
      const jobRes = await fetch(
        `http://127.0.0.1:8000/api/company/company-jobs/${jobId}/`,
        { headers }
      );
      if (jobRes.ok) {
        const job = await jobRes.json();
        setJobData({
          jobTitle: job.job_title,
          companyName: job.company_name || "",
          location: job.location || "",
          salary: job.salary || "",
          postedDate: job.created_at,
        });
      }

      /* -------- Fetch applicants -------- */
      const appRes = await fetch(
        `http://127.0.0.1:8000/api/company/jobs/${jobId}/applications/`,
        { headers }
      );

      if (appRes.ok) {
        const data = await appRes.json();

        setApplicants(
          (Array.isArray(data) ? data : []).map((a) => ({
            id: a.application_id,
            name: a.name,
            email: a.email,
            location: a.location,
            experience: a.total_experience,
            appliedDate: a.applied_at,
            status: a.application_status, // already lowercase
            atsScore: a.ats_score || 0,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading applicants", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HELPERS ================= */
  const getAtsScoreClass = (score) => {
    if (score >= 80) return "ats-high";
    if (score >= 60) return "ats-medium";
    return "ats-low";
  };

  const getStatusBadge = (status) => {
    const map = {
      applied: "bg-primary/10 text-primary",
      shortlisted: "bg-success/10 text-success",
      interview: "bg-warning/10 text-warning",
      rejected: "bg-destructive/10 text-destructive",
    };
    return map[status] || map.applied;
  };

  /* ================= FILTER ================= */
  const filteredApplicants = applicants.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "all" || a.status === filterStatus;

    return matchSearch && matchStatus;
  });

  /* ================= STATS ================= */
  const stats = [
    {
      label: "Total Applicants",
      value: applicants.length,
      icon: Users,
    },
    {
      label: "Shortlisted",
      value: applicants.filter((a) => a.status === "shortlisted").length,
      icon: UserCheck,
    },
    {
      label: "Interviews",
      value: applicants.filter((a) => a.status === "interview").length,
      icon: Calendar,
    },
    {
      label: "Avg ATS Score",
      value: applicants.length
        ? Math.round(
            applicants.reduce((s, a) => s + (a.atsScore || 0), 0) /
              applicants.length
          )
        : 0,
      icon: TrendingUp,
    },
  ];

  /* ================= LOADING ================= */
  if (loading || !jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading applicants...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">AIMatch</span>
          </Link>

          <button
            onClick={() => navigate("/company/dashboard")}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Job Info */}
        <div className="glass-card p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold">{jobData.jobTitle}</h1>
          <p className="text-muted-foreground">{jobData.companyName}</p>
          <p className="text-sm mt-2">
            📍 {jobData.location} | 💰 {jobData.salary} | 📅{" "}
            {new Date(jobData.postedDate).toLocaleDateString()}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="card-interactive p-4">
              <s.icon />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl mb-6 flex gap-4">
          <input
            className="input-field flex-1"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applicants */}
        {filteredApplicants.length ? (
          filteredApplicants.map((a) => (
            <div key={a.id} className="card-interactive p-4 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{a.name}</h3>
                  <p className="text-sm text-muted-foreground">{a.email}</p>
                  <p className="text-xs mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(a.appliedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`status-badge ${getStatusBadge(a.status)}`}>
                    {a.status}
                  </span>
                  <span className={`ats-score ${getAtsScoreClass(a.atsScore)}`}>
                    {a.atsScore}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No applicants found
          </p>
        )}
      </main>
    </div>
  );
};

export default JobApplicants;
