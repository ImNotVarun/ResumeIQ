import { useState } from 'react';
import {
  Download,
  Lock,
  Sparkles,
  FileText,
  Briefcase,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import { useResumeStore, AnalysisResult } from '../store/resumeStore';
import { analyzeResume } from '../lib/atsEngine';
import { FileDropzone } from '../components/FileDropzone';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { showToast } from '../components/Toast';

export function AnalyzePage() {
  const {
    setCurrentResume,
    currentJobDescription,
    setCurrentJobDescription,
    saveAnalysis,
  } = useResumeStore();

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

      showToast('Analysis completed successfully', 'success');
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
${analysis.issues
        .map(
          (issue) =>
            `- [${issue.severity.toUpperCase()}] ${issue.category}: ${issue.message
            }\n  Suggestion: ${issue.suggestion}`
        )
        .join('\n\n')}

Generated: ${new Date().toLocaleString()}
`.trim();

    const element = document.createElement('a');

    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`
    );

    element.setAttribute(
      'download',
      `resumeiq-analysis-${analysis.id}.txt`
    );

    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showToast('Results downloaded', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#0b1120] dark:via-[#111827] dark:to-[#0f172a]">

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-10">

        {/* HEADER */}
        <div className="mb-10">

        </div>


        {/* TOP SECTION */}
        <div className="grid xl:grid-cols-2 gap-8 items-stretch">

          {/* UPLOAD */}
          <div className="rounded-3xl border border-white/20 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-8 flex flex-col">

            <div className="flex items-center gap-4 mb-6">

              <div className="p-3 rounded-2xl bg-primary/10">
                <FileText
                  className="text-primary"
                  size={24}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">
                  Upload Resume
                </h2>

                <p className="text-sm text-muted">
                  Upload PDF, DOCX, or TXT files
                </p>
              </div>
            </div>

            <div className="flex-1 flex">
              <div className="w-full">
                <FileDropzone
                  onFileSelect={handleFileSelect}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {/* JOB DESCRIPTION */}
          <div className="rounded-3xl border border-white/20 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-8 flex flex-col">

            <div className="flex items-center gap-4 mb-6">

              <div className="p-3 rounded-2xl bg-primary/10">
                <Briefcase
                  className="text-primary"
                  size={24}
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-dark dark:text-white">
                  Job Description
                </h2>

                <p className="text-sm text-muted">
                  Match resume against recruiter requirements
                </p>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description here to analyze ATS keywords, missing skills, recruiter intent, and compatibility score..."
              className="
              flex-1
              min-h-[350px]
              w-full
              rounded-2xl
              border
              border-gray-200
              dark:border-white/10
              bg-white/80
              dark:bg-black/20
              p-5
              text-dark
              dark:text-white
              placeholder:text-muted
              resize-none
              outline-none
              transition-all
              focus:ring-2
              focus:ring-primary/40
              focus:border-primary
            "
            />

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted">
                Optional but highly recommended
              </p>

              <p className="text-xs font-semibold text-primary">
                {jobDescription.length} characters
              </p>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-8 mb-10">

          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeText.trim()}
            className={`
            relative
            overflow-hidden
            w-full
            rounded-2xl
            py-5
            font-bold
            text-lg
            text-white
            transition-all
            duration-300
            shadow-2xl
            ${loading || !resumeText.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary via-indigo-600 to-purple-600 hover:scale-[1.01]'
              }
          `}
          >

            <span className="flex items-center justify-center gap-3">

              {loading ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={22}
                  />

                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={22} />

                  Analyze Resume
                </>
              )}
            </span>
          </button>
        </div>

        {/* ANALYSIS */}
        {analysis ? (

          <div className="space-y-8">

            {/* SCORE */}
            <div className="rounded-3xl border border-white/20 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-8">

              <ScoreDisplay
                overallScore={analysis.overallScore}
                scores={analysis.scores}
              />
            </div>

            {/* ISSUES */}
            <div className="rounded-3xl border border-white/20 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-8">

              <div className="flex items-center gap-4 mb-8">

                <div className="p-3 rounded-2xl bg-warning/10">
                  <AlertTriangle
                    className="text-warning"
                    size={24}
                  />
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-dark dark:text-white">
                    Issues & Suggestions
                  </h3>

                  <p className="text-sm text-muted">
                    ATS optimization recommendations
                  </p>
                </div>
              </div>

              {analysis.issues.length > 0 ? (

                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">

                  {analysis.issues.map((issue, i) => (

                    <div
                      key={i}
                      className="
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-white/10
                      bg-white/60
                      dark:bg-black/20
                      p-6
                      hover:shadow-lg
                      transition-all
                    "
                    >

                      <div className="flex items-center gap-3 mb-4">

                        <span
                          className={`
                          text-xs
                          font-bold
                          uppercase
                          px-3
                          py-1
                          rounded-full
                          ${issue.severity === 'error'
                              ? 'bg-red-500/10 text-red-500'
                              : issue.severity === 'warning'
                                ? 'bg-yellow-500/10 text-yellow-500'
                                : 'bg-blue-500/10 text-blue-500'
                            }
                        `}
                        >
                          {issue.severity}
                        </span>

                        <span className="font-semibold text-dark dark:text-white">
                          {issue.category}
                        </span>
                      </div>

                      <p className="text-sm text-muted leading-relaxed mb-5">
                        {issue.message}
                      </p>

                      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">

                        <p className="text-sm text-dark dark:text-white leading-relaxed">
                          💡 {issue.suggestion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

              ) : (

                <div className="text-center py-12">

                  <CheckCircle2
                    size={60}
                    className="mx-auto mb-5 text-emerald-500"
                  />

                  <h4 className="text-2xl font-bold text-dark dark:text-white mb-2">
                    Excellent Resume
                  </h4>

                  <p className="text-muted">
                    No major ATS issues were detected
                  </p>
                </div>
              )}
            </div>

            {/* DOWNLOAD */}
            <button
              onClick={downloadResults}
              className="
              w-full
              rounded-2xl
              border
              border-primary/20
              bg-white/70
              dark:bg-white/5
              backdrop-blur-xl
              py-4
              font-semibold
              flex
              items-center
              justify-center
              gap-3
              hover:shadow-xl
              hover:border-primary/40
              transition-all
            "
            >

              <Download size={20} />

              Download Analysis Report
            </button>
          </div>

        ) : (

          <div className="rounded-3xl border border-dashed border-gray-300 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-xl min-h-[350px] flex items-center justify-center p-10">

            <div className="text-center max-w-xl">

              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">

                <Sparkles
                  size={42}
                  className="text-primary"
                />
              </div>

              <h3 className="text-3xl font-bold text-dark dark:text-white mb-4">
                Ready for ATS Analysis
              </h3>

              <p className="text-muted leading-relaxed text-lg">
                Upload your resume and optionally add a job description
                to receive advanced ATS analysis, recruiter optimization,
                keyword scoring, and formatting suggestions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}