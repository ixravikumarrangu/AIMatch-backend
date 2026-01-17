import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  Save,
  Upload,
  FileText,
  X,
  CheckCircle2,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    skills: "",
    education: "",
    about: "",
  });

  // User ID state
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    // Get user email from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (!userData || !userData.email) return;
    setFormData((prev) => ({ ...prev, email: userData.email }));
    // Fetch user credentials to get user_id
    fetch(
      `http://127.0.0.1:8000/api/user/user-credentials/?email=${encodeURIComponent(
        userData.email
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUserId(data[0].user_id);
          // Fetch profile
          fetch(
            `http://127.0.0.1:8000/api/user/user-profiles/${data[0].user_id}/`
          )
            .then((res) => {
              if (res.ok) return res.json();
              return null;
            })
            .then((profileData) => {
              if (profileData) {
                setFormData({
                  name: profileData.name || "",
                  email: userData.email,
                  phone: profileData.phone || "",
                  address: profileData.address || "",
                  experience: profileData.experience || "",
                  skills: profileData.skills || "",
                  education: profileData.education || "",
                  about: profileData.about || "",
                });
              }
            });
        }
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOC file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB");
      return;
    }
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    // Upload to backend
    if (!userId) {
      alert("User ID not loaded yet.");
      setIsUploading(false);
      return;
    }
    const formDataObj = new FormData();
    formDataObj.append("resume", file);
    formDataObj.append("user_id", userId);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/upload_resume/", {
        method: "POST",
        body: formDataObj,
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedResume({
          fileName: file.name,
          fileSize: file.size,
          uploadedDate: new Date().toISOString(),
        });
        // Optionally update resume_text in formData
        setFormData((prev) => ({
          ...prev,
          resume_text: data.resume_json.resume_text || "",
        }));
      } else {
        alert("Resume upload failed");
      }
    } catch (err) {
      alert("Error uploading resume");
    }
    setIsUploading(false);
    setSelectedFile(null);
    setUploadProgress(100);
  };

  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Save resume to localStorage
          const resumeData = {
            fileName: file.name,
            fileSize: file.size,
            uploadedDate: new Date().toISOString(),
          };

          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          userData.resume = resumeData;
          localStorage.setItem("userData", JSON.stringify(userData));

          setUploadedResume(resumeData);
          setSelectedFile(null);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeResume = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    delete userData.resume;
    localStorage.setItem("userData", JSON.stringify(userData));

    setUploadedResume(null);
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (!userId) {
      alert("User ID not loaded yet.");
      setIsSaving(false);
      return;
    }
    // Prepare payload for API
    const payload = {
      user: userId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      experience: formData.experience,
      skills: formData.skills,
      education: formData.education,
      about: formData.about,
      // resume_text excluded to prevent overwriting
    };
    // Try PATCH first
    let res = await fetch(
      `http://127.0.0.1:8000/api/user/user-profiles/${userId}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      // If PATCH fails, try POST (create)
      res = await fetch("http://127.0.0.1:8000/api/user/user-profiles/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setIsSaving(false);
    if (res.ok) {
      alert("Profile updated successfully!");
      navigate("/user/dashboard");
    } else {
      alert("Failed to update profile");
    }
  };

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

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Profile Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Update your personal information and professional details
          </p>
        </div>

        {/* Resume Upload Section */}
        <div className="glass-card rounded-xl p-8 mb-6 animate-slide-up">
          <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Resume
          </h2>

          {uploadedResume ? (
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {uploadedResume.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedResume.fileSize / 1024).toFixed(2)} KB •
                      Uploaded{" "}
                      {new Date(
                        uploadedResume.uploadedDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeResume}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  title="Remove resume"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-success text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resume uploaded successfully!</span>
              </div>
            </div>
          ) : (
            <div>
              {!selectedFile ? (
                <div className="p-6 bg-muted/30 border-2 border-dashed border-border rounded-xl text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your resume to improve your job matches
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary"
                  >
                    <Upload className="w-5 h-5" />
                    Choose Resume File
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setUploadProgress(0);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Uploading...
                        </span>
                        <span className="font-medium text-primary">
                          {uploadProgress}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="glass-card rounded-xl p-8 animate-slide-up delay-100">
            <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Personal Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field w-full"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
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
                      placeholder="john@example.com"
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
                  Location
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
            </div>
          </div>

          {/* Professional Information */}
          <div className="glass-card rounded-xl p-8 animate-slide-up delay-200">
            <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Professional Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Total Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="e.g., 5 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="input-field w-full"
                  placeholder="e.g., React, JavaScript, TypeScript, Node.js"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Education
                </label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  rows={3}
                  className="input-field w-full resize-none"
                  placeholder="e.g., Bachelor's in Computer Science, XYZ University (2015-2019)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  About Me
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="input-field w-full resize-none"
                  placeholder="Tell us about yourself, your career goals, and what you're looking for..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 animate-slide-up delay-300">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
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
        {formData.name && (
          <div className="glass-card rounded-xl p-8 mt-6 animate-slide-up delay-400">
            <h2 className="text-xl font-display font-bold text-foreground mb-4">
              Profile Preview
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-2xl">
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {formData.name}
                </h3>
                {formData.email && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {formData.email}
                  </p>
                )}
                {formData.address && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {formData.address}
                  </p>
                )}
                {formData.experience && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                    <Briefcase className="w-4 h-4" />
                    {formData.experience} of experience
                  </p>
                )}
                {formData.skills && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;

// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     location: "",
//     total_experience: "",
//     skills: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     // Get user email from localStorage
//     const userData = JSON.parse(localStorage.getItem("userData"));
//     if (!userData || !userData.email) return;
//     // Fetch user credentials to get user_id
//     fetch(
//       `http://127.0.0.1:8000/api/user/user-credentials/?email=${encodeURIComponent(
//         userData.email
//       )}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data) && data.length > 0) {
//           setUserId(data[0].user_id);
//           // Fetch profile
//           fetch(
//             `http://127.0.0.1:8000/api/user/user-profiles/${data[0].user_id}/`
//           )
//             .then((res) => {
//               if (res.ok) return res.json();
//               // If not found, treat as new profile
//               return null;
//             })
//             .then((profileData) => {
//               if (profileData) {
//                 setProfile({
//                   full_name: profileData.full_name || "",
//                   email: userData.email,
//                   phone: profileData.phone || "",
//                   location: profileData.location || "",
//                   total_experience: profileData.total_experience || "",
//                   skills: "", // Skills handled separately
//                 });
//               } else {
//                 setProfile((p) => ({ ...p, email: userData.email }));
//               }
//               setLoading(false);
//             });
//         }
//       });
//   }, []);

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!userId) return;
//     setLoading(true);
//     // PATCH or POST profile
//     const payload = {
//       user: userId,
//       full_name: profile.full_name,
//       phone: profile.phone,
//       location: profile.location,
//       total_experience: profile.total_experience,
//       resume_text: "",
//     };
//     // Try PATCH first
//     let res = await fetch(
//       `http://127.0.0.1:8000/api/user/user-profiles/${userId}/`,
//       {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       }
//     );
//     if (!res.ok) {
//       // If PATCH fails, try POST (create)
//       res = await fetch(`http://127.0.0.1:8000/api/user/user-profiles/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//     }
//     // Optionally handle skills here (not implemented)
//     setLoading(false);
//     if (res.ok) {
//       navigate("/user/dashboard");
//     } else {
//       alert("Failed to update profile");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );

//   return (
//     <div
//       className="w-full min-h-screen flex items-center justify-center p-6 md:p-12 bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.65),rgba(0,0,0,0.85))] bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab')",
//       }}
//     >
//       <form onSubmit={handleSubmit}>
//         <p>Name: </p>
//         <input
//           name="full_name"
//           type="text"
//           className="lg:flex items-center justify-center p-1"
//           placeholder="Enter your name"
//           value={profile.full_name}
//           onChange={handleChange}
//         />
//         <br />
//         <p>Email: </p>
//         <input
//           name="email"
//           type="text"
//           className="lg:flex items-center justify-center p-1"
//           value={profile.email}
//           disabled
//         />
//         <br />
//         <p>Phone:</p>
//         <input
//           name="phone"
//           type="text"
//           className="lg:flex items-center justify-center p-1"
//           placeholder="Enter your phone number"
//           value={profile.phone}
//           onChange={handleChange}
//         />
//         <br />
//         <p>Address: </p>
//         <input
//           name="location"
//           type="text"
//           className="lg:flex items-center justify-center p-1"
//           placeholder="Enter your address"
//           value={profile.location}
//           onChange={handleChange}
//         />
//         <br />
//         <p>Total experience: </p>
//         <input
//           name="total_experience"
//           type="number"
//           className="lg:flex items-center justify-center p-1"
//           placeholder="Enter your experience"
//           value={profile.total_experience}
//           onChange={handleChange}
//         />
//         <br />
//         {/* Skills input can be implemented here if needed */}
//         <button
//           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//           type="submit"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };
// export default Profile;
