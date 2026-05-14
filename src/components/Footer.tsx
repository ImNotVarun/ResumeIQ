import { Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-sora font-bold text-dark dark:text-white mb-4">
              Resume<span className="text-primary">IQ</span>
            </h3>
            <p className="text-sm text-muted">
              AI-free ATS optimization. All analysis happens locally on your device.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-dark dark:text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="/analyze" className="hover:text-primary transition-colors">Resume Analyzer</a></li>
              <li><a href="/keywords" className="hover:text-primary transition-colors">Keyword Checker</a></li>
              <li><a href="/format" className="hover:text-primary transition-colors">Formatter Tips</a></li>
              <li><a href="/cover-letter" className="hover:text-primary transition-colors">Cover Letter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-dark dark:text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/history" className="hover:text-primary transition-colors">Score History</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-dark dark:text-white mb-4">Privacy</h4>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Lock size={16} />
              <span>100% Private - No Data Sent</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex justify-between items-center text-sm text-muted">
          <p>&copy; 2024 ResumeIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
