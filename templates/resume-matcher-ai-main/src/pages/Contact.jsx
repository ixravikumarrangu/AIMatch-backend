import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'hello@aimatch.com',
      description: 'We typically respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri from 9am to 6pm EST',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: '123 Tech Hub Street',
      description: 'San Francisco, CA 94105',
    },
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
                Get In Touch
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                We'd Love to{' '}
                <span className="text-gradient">Hear From You</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions about our platform? Want to learn more about how AI can 
                transform your hiring process? We're here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactInfo.map((info, index) => (
                <div
                  key={info.title}
                  className={`card-interactive p-6 text-center animate-slide-up delay-${(index + 1) * 100}`}
                >
                  <div className="w-14 h-14 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <info.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {info.title}
                  </h3>
                  <p className="text-primary font-medium mb-1">{info.value}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="glass-card rounded-2xl p-8 md:p-12 animate-slide-up delay-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto rounded-xl gradient-accent flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-foreground" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-8 animate-scale-in">
                    <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                      <Send className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll respond to your inquiry shortly.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn-secondary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="input-field"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        className="input-field resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full justify-center disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Response Time Note */}
              <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground animate-slide-up delay-400">
                <Clock className="w-4 h-4" />
                Average response time: Less than 24 hours
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
