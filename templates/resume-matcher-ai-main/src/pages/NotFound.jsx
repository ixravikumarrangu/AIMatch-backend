import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center animate-slide-up">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-display font-bold text-foreground">
            AI<span className="text-gradient">Match</span>
          </span>
        </Link>

        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-display font-bold text-gradient mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
