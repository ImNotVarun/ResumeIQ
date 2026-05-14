import { useState } from 'react';
import { Download } from 'lucide-react';
import { scoreKeywords } from '../lib/atsEngine';
import { FileDropzone } from '../components/FileDropzone';
import { KeywordChip } from '../components/KeywordChip';
import { showToast } from '../components/Toast';

export function KeywordsPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<{
    matchedKeywords: string[];
    missingKeywords: string[];
    matchScore: number;
  } | null>(null);

  const handleAnalyze = () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      showToast('Please paste both job description and resume', 'error');
      return;
    }

    const result = scoreKeywords(resumeText, jobDescription);
    const matchScore = Math.round((result.matchedKeywords.length / (result.matchedKeywords.length + result.missingKeywords.length)) * 100) || 0;

    setAnalysis({
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      matchScore,
    });

    showToast('Keywords analyzed', 'success');
  };

  const downloadReport = () => {
    if (!analysis) return;

    const content = `
ResumeIQ - Keyword Gap Analysis
================================

Match Score: ${analysis.matchScore}%
Matched Keywords: ${analysis.matchedKeywords.length}
Missing Keywords: ${analysis.missingKeywords.length}

Matched Keywords (${analysis.matchedKeywords.length}):
${analysis.matchedKeywords.map((kw) => `✓ ${kw}`).join('\n')}

Missing Keywords (${analysis.missingKeywords.length}):
${analysis.missingKeywords.map((kw) => `✗ ${kw}`).join('\n')}

Recommendations:
- Add missing keywords naturally throughout your resume
- Focus on high-impact technical terms from the job description
- Use exact terminology from the job listing
- Distribute keywords across multiple sections (Summary, Experience, Skills)

Generated: ${new Date().toLocaleString()}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', 'keyword-gap-analysis.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Report downloaded', 'success');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-sora font-bold text-dark dark:text-white mb-2">Keyword Gap Checker</h1>
          <p className="text-muted">Identify missing keywords and improve your match rate with job descriptions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-sora font-semibold text-dark dark:text-white mb-4">Job Description</h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-light-dark text-dark dark:text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-sora font-semibold text-dark dark:text-white mb-4">Your Resume</h2>
              <div className="mb-4">
                <FileDropzone onFileSelect={setResumeText} />
              </div>
              <div className="text-xs text-muted">Or paste resume text:</div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-light-dark text-dark dark:text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary mt-2"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          className="w-full pill-btn-primary py-4 text-lg font-semibold mt-8"
        >
          Analyze Keywords
        </button>

        {analysis && (
          <div className="mt-12 space-y-8">
            {/* Match Score */}
            <div className="card">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-muted mb-2">Keyword Match Score</p>
                  <div className="text-5xl font-sora font-bold text-primary">{analysis.matchScore}%</div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted mb-1">Matched</p>
                  <p className="text-2xl font-bold text-success">{analysis.matchedKeywords.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted mb-1">Missing</p>
                  <p className="text-2xl font-bold text-error">{analysis.missingKeywords.length}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-success h-full transition-all duration-500"
                  style={{ width: `${analysis.matchScore}%` }}
                ></div>
              </div>
            </div>

            {/* Matched Keywords */}
            {analysis.matchedKeywords.length > 0 && (
              <div className="card">
                <h3 className="font-sora font-semibold text-dark dark:text-white mb-4">
                  Matched Keywords ({analysis.matchedKeywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((kw, i) => (
                    <KeywordChip key={i} keyword={kw} type="matched" />
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {analysis.missingKeywords.length > 0 && (
              <div className="card">
                <h3 className="font-sora font-semibold text-dark dark:text-white mb-4">
                  Missing Keywords ({analysis.missingKeywords.length})
                </h3>
                <p className="text-sm text-muted mb-4">
                  Consider adding these keywords naturally to your resume to improve your match score.
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <KeywordChip key={i} keyword={kw} type="missing" />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={downloadReport}
              className="w-full pill-btn-secondary py-3 flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Download Gap Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
