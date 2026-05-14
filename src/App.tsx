import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useResumeStore } from './store/resumeStore';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { KeywordsPage } from './pages/KeywordsPage';
import { FormatterPage } from './pages/FormatterPage';
import { CoverLetterPage } from './pages/CoverLetterPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  const { darkMode } = useResumeStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-dark text-light-dark dark:text-white transition-colors duration-300">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/keywords" element={<KeywordsPage />} />
            <Route path="/format" element={<FormatterPage />} />
            <Route path="/cover-letter" element={<CoverLetterPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <Toast />
      </div>
    </Router>
  );
}

export default App;
