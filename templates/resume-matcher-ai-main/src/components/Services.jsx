import { FileText, GitCompare, UserCheck, Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: 'Resume Parsing',
      description: 'Advanced AI extracts key skills, experience, and qualifications from any resume format.',
      color: 'primary',
    },
    {
      icon: GitCompare,
      title: 'Smart Job Matching',
      description: 'Intelligent algorithms match candidates to job descriptions with precision accuracy.',
      color: 'accent',
    },
    {
      icon: UserCheck,
      title: 'Smart Shortlisting',
      description: 'Automatically rank and shortlist candidates based on customizable criteria.',
      color: 'success',
    },
    {
      icon: Rocket,
      title: 'Faster Hiring',
      description: 'Reduce time-to-hire by 70% with automated screening and instant recommendations.',
      color: 'warning',
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'gradient-primary',
      accent: 'gradient-accent',
      success: 'bg-success',
      warning: 'bg-warning',
    };
    return colors[color] || colors.primary;
  };

  return (
    <section className="py-24 relative overflow-hidden" id="features">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Powerful Features for{' '}
            <span className="text-gradient">Modern Hiring</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to transform your recruitment process with AI-powered tools and insights.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`card-interactive p-6 animate-slide-up delay-${(index + 1) * 100}`}
            >
              <div className={`w-14 h-14 rounded-xl ${getColorClasses(service.color)} flex items-center justify-center mb-5`}>
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {service.title}
              </h3>

              <p className="text-muted-foreground mb-4">
                {service.description}
              </p>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-primary text-sm font-medium group"
              >
                Learn more
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-slide-up delay-500">
          <div className="glass-card inline-block rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Ready to Transform Your Hiring?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of companies already using AIMatch to find the best talent.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/company/register" className="btn-primary group">
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
