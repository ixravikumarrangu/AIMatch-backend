import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Target, BarChart3 } from 'lucide-react';

const HeroSection = () => {
  const features = [
    'AI-Powered Matching',
    'Instant ATS Scores',
    'Smart Shortlisting',
  ];

  const stats = [
    { icon: Zap, value: '10x', label: 'Faster Hiring' },
    { icon: Target, value: '95%', label: 'Match Accuracy' },
    { icon: BarChart3, value: '50K+', label: 'Resumes Processed' },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Recruitment Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
              Find Your Perfect{' '}
              <span className="text-gradient">Candidate Match</span>{' '}
              Instantly
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Leverage AI to match resumes with job descriptions, generate ATS scores, and streamline your hiring process like never before.
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 text-sm font-medium text-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/company/login" className="btn-primary group">
                Start Hiring
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/user/login" className="btn-secondary">
                Find Jobs
              </Link>
            </div>
          </div>

          {/* Right Content - Stats Card */}
          <div className="relative animate-slide-up delay-200">
            <div className="relative">
              {/* Main Card */}
              <div className="glass-card rounded-2xl p-8 animate-float">
                <h3 className="font-display font-semibold text-lg text-foreground mb-6">
                  Platform Performance
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className={`text-center animate-scale-in delay-${(index + 1) * 100}`}
                    >
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl gradient-primary flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="text-2xl font-display font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sample Match Preview */}
                <div className="mt-8 p-4 rounded-xl bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Latest Match</span>
                    <span className="ats-score ats-high text-sm">92</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-foreground font-semibold text-sm">
                      JD
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">John Doe</p>
                      <p className="text-xs text-muted-foreground">Senior Developer • 5 yrs exp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl gradient-accent opacity-20 blur-xl animate-pulse-slow" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl animate-pulse-slow delay-200" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
