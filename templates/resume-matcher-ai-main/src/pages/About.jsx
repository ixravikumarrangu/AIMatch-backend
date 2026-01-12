import Header from "../components/Header";
import Footer from "../components/Footer";
import { Target, Users, Award, Rocket, Heart, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "We are committed to revolutionizing the hiring process through innovative AI technology.",
    },
    {
      icon: Users,
      title: "People-First",
      description:
        "Every feature we build is designed with candidates and recruiters in mind.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from algorithms to user experience.",
    },
    {
      icon: Shield,
      title: "Trust & Privacy",
      description: "Your data security and privacy are our top priorities.",
    },
  ];

  const team = [
    { name: "Dinesh", role: "Frontend", initial: "D" },
    { name: "Ravi", role: "Backend", initial: "R" },
    { name: "Preetham", role: "Frontend", initial: "P" },
    { name: "Sahith", role: "Backend", initial: "S" },
    { name: "Sujith", role: "Backend", initial: "S" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                About AIMatch
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                Transforming Recruitment with{" "}
                <span className="text-gradient">Artificial Intelligence</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We're on a mission to make hiring smarter, faster, and more
                human. Our AI-powered platform connects the right talent with
                the right opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    AIMatch was founded in 2023 with a simple idea: what if we
                    could use AI to eliminate the guesswork from hiring?
                  </p>
                  <p>
                    Traditional recruitment is time-consuming and often biased.
                    Recruiters spend countless hours screening resumes, while
                    qualified candidates get overlooked because of keyword
                    mismatches.
                  </p>
                  <p>
                    Our platform uses advanced machine learning algorithms to
                    understand the true potential of every candidate, matching
                    skills, experience, and cultural fit with unprecedented
                    accuracy.
                  </p>
                </div>
              </div>
              <div className="animate-slide-up delay-200">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "10,000+", label: "Companies Trust Us" },
                    { value: "500K+", label: "Successful Matches" },
                    { value: "95%", label: "Client Satisfaction" },
                    { value: "70%", label: "Time Saved" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="card-interactive p-6 text-center"
                    >
                      <div className="text-3xl font-display font-bold text-gradient mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className={`card-interactive p-6 text-center animate-slide-up delay-${
                    (index + 1) * 100
                  }`}
                >
                  <div className="w-14 h-14 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <value.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Passionate people building the future of recruitment
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={member.name}
                  className={`card-interactive p-6 text-center animate-slide-up delay-${
                    (index + 1) * 100
                  }`}
                >
                  <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4 text-primary-foreground font-display font-bold text-xl">
                    {member.initial}
                  </div>
                  <h3 className="font-display font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
