import { useState } from 'react';
import { Download, Lock } from 'lucide-react';
import { useResumeStore, AnalysisResult } from '../store/resumeStore';
import { analyzeResume } from '../lib/atsEngine';
import { FileDropzone } from '../components/FileDropzone';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { showToast } from '../components/Toast';

export function AnalyzePage() {
  const { setCurrentResume, currentJobDescription, setCurrentJobDescription, saveAnalysis } = useResumeStore();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState(currentJobDescription);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (text: string) => {
    setResumeText(text);
    setCurrentResume(text);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      showToast('Please upload a resume first', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = analyzeResume(resumeText, jobDescription);

      const analysisResult: AnalysisResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        resumeText,
        jobDescription,
        overallScore: result.overallScore,
        scores: {
          format: result.scores.format,
          contact: result.scores.contact,
          keywords: result.scores.keywords,
          sections: result.scores.sections,
          bullets: result.scores.bullets,
          quantification: result.scores.quantification,
        },
        issues: result.issues,
        matchedKeywords: [],
        missingKeywords: [],
      };

      setAnalysis(analysisResult);
      saveAnalysis(analysisResult);
      setCurrentJobDescription(jobDescription);
      showToast('Analysis saved automatically', 'success');
    } catch (error) {
      showToast('Error during analysis', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!analysis) return;

    const content = `
ResumeIQ - ATS Analysis Report
==============================

Overall Score: ${analysis.overallScore}/100

Score Breakdown:
- Format: ${analysis.scores.format}/20
- Contact Info: ${analysis.scores.contact}/10
- Keywords: ${analysis.scores.keywords}/25
- Sections: ${analysis.scores.sections}/20
- Bullet Points: ${analysis.scores.bullets}/15
- Quantification: ${analysis.scores.quantification}/10

Issues & Suggestions:
${analysis.issues.map((issue) => `- [${issue.severity.toUpperCase()}] ${issue.category}: ${issue.message}\n  Suggestion: ${issue.suggestion}`).join('\n\n')}

Generated: ${new Date().toLocaleString()}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', `resumeiq-analysis-${analysis.id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Results downloaded', 'success');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-sora font-bold text-dark dark:text-white mb-2">Resume Analyzer</h1>
          <p className="text-muted">Upload your resume and job description to get an ATS compatibility score</p>
        </div>

        <div className="flex items-center gap-2 mb-8 px-4 py-3 bg-primary/10 border border-primary/30 rounded-lg w-fit">
          <Lock size={18} className="text-primary" />
          <span className="text-sm font-medium text-dark">100% Private - No Data Sent to Server</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-sora font-semibold text-dark dark:text-white mb-4">Upload Resume</h2>
              <FileDropzone onFileSelect={handleFileSelect} loading={loading} />
            </div>

            <div>
              <h2 className="text-xl font-sora font-semibold text-dark dark:text-white mb-4">Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to match keywords..."
                className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-light-dark text-dark dark:text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted mt-2">Optional: Helps identify missing keywords and improve match score</p>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim()}
              className={`w-full pill-btn-primary py-4 text-lg font-semibold transition-all ${
                loading || !resumeText.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>

          {/* Right Panel - Results */}
          <div>
            {analysis ? (
              <div className="space-y-6">
                <ScoreDisplay overallScore={analysis.overallScore} scores={analysis.scores} />

                {analysis.issues.length > 0 && (
                  <div className="card">
                    <h3 className="font-sora font-semibold text-dark dark:text-white mb-4">Issues & Suggestions</h3>
                    <div className="space-y-4">
                      {analysis.issues.map((issue, i) => (
                        <div key={i} className="border-l-4 border-warning pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              issue.severity === 'error'
                                ? 'bg-error/20 text-error'
                                : issue.severity === 'warning'
                                  ? 'bg-warning/20 text-warning'
                                  : 'bg-primary/20 text-primary'
                            }`}>
                              {issue.severity.toUpperCase()}
                            </span>
                            <span className="font-semibold text-dark dark:text-white text-sm">{issue.category}</span>
                          </div>
                          <p className="text-sm text-muted mb-2">{issue.message}</p>
                          <p className="text-sm bg-gray-50 dark:bg-dark/50 p-2 rounded italic text-dark dark:text-white">
                            💡 {issue.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={downloadResults}
                  className="w-full pill-btn-secondary py-3 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Results
                </button>
              </div>
            ) : (
              <div className="card h-96 flex items-center justify-center text-center">
                <div>
                  <p className="text-muted mb-2">Upload a resume and click analyze</p>
                  <p className="text-sm text-muted">Results will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
