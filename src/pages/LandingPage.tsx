import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, FileText, PenTool } from 'lucide-react';
import { Footer } from '../components/Footer';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap size={32} className="text-primary" />,
      title: 'ATS Score',
      description: 'Get a comprehensive ATS compatibility score based on formatting, keywords, and structure.',
    },
    {
      icon: <CheckCircle size={32} className="text-primary" />,
      title: 'Keyword Checker',
      description: 'Match your resume against job descriptions and identify missing high-value keywords.',
    },
    {
      icon: <FileText size={32} className="text-primary" />,
      title: 'Resume Formatter',
      description: 'Follow a checklist to optimize formatting, fonts, and sections for ATS systems.',
    },
    {
      icon: <PenTool size={32} className="text-primary" />,
      title: 'Cover Letter Tips',
      description: 'Generate cover letters tailored to job descriptions with proper formatting.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Upload Your Resume',
      description: 'Drop your PDF, DOCX, or TXT file. All processing happens locally.',
    },
    {
      number: '2',
      title: 'Paste Job Description',
      description: 'Add the job description to match against and identify relevant keywords.',
    },
    {
      number: '3',
      title: 'Get Optimization Tips',
      description: 'Receive actionable suggestions to improve your ATS score and match rate.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      feedback: 'Improved my ATS score from 62 to 89. Got 3x more interviews!',
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Manager',
      feedback: 'The keyword matcher showed me exactly what I was missing. Game changer.',
    },
    {
      name: 'Emily Davis',
      role: 'Data Analyst',
      feedback: 'Simple, fast, and actually helpful. No nonsense, just results.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero dark:bg-gradient-to-br dark:from-secondary dark:to-accent pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6">
            <span className="text-sm font-semibold text-dark">Rule-Based ATS Analysis</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-sora font-bold text-dark mb-6">
            Optimize Your Resume<br />for ATS Systems
          </h1>

          <p className="text-xl text-dark/80 mb-10 max-w-2xl mx-auto">
            Get a detailed ATS score, identify missing keywords, and optimize your resume formatting.
            All analysis happens locally—your data never leaves your device.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/analyze')}
              className="pill-btn-primary text-lg px-8 py-4"
            >
              Start Free Analysis
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-sora font-bold text-center text-dark dark:text-white mb-16">
              Powerful Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="card hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="font-sora font-bold text-dark dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-light-dark/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-sora font-bold text-center text-dark dark:text-white mb-16">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary text-dark rounded-full flex items-center justify-center font-sora font-bold text-lg">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sora font-bold text-dark dark:text-white mb-2">{step.title}</h3>
                      <p className="text-muted text-sm">{step.description}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-24 w-12 h-1 bg-gradient-to-r from-primary to-transparent ml-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-sora font-bold text-center text-dark dark:text-white mb-16">
              What Users Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="card">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-primary text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-dark dark:text-white mb-4 italic">"{testimonial.feedback}"</p>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="font-semibold text-dark dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero dark:bg-gradient-to-br dark:from-secondary dark:to-accent">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-sora font-bold text-dark mb-6">Ready to optimize your resume?</h2>
            <p className="text-lg text-dark/80 mb-8">
              Get instant feedback on your ATS compatibility and start landing more interviews.
            </p>
            <button
              onClick={() => navigate('/analyze')}
              className="pill-btn-primary text-lg px-8 py-4"
            >
              Analyze Your Resume Now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
