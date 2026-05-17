import { useState } from 'react';
import {
  Check,
  X,
  Download,
  Sparkles,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { FileDropzone } from '../components/FileDropzone';
import { showToast } from '../components/Toast';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  warning: string;
  completed: boolean;
  autoDetected?: boolean;
}

export function FormatterPage() {
  const [resumeText, setResumeText] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'file-format',
      category: 'File Format',
      title: 'Use standard file format',
      description: 'Save as PDF or DOCX, not as image or scanned PDF',
      warning: 'Resume should be a text-based PDF or Word document',
      completed: false,
    },
    {
      id: 'single-column',
      category: 'Layout',
      title: 'Single column layout',
      description: 'Avoid multi-column designs and text boxes',
      warning: 'Multi-column layouts can confuse ATS systems',
      completed: false,
    },
    {
      id: 'font',
      category: 'Fonts',
      title: 'Use ATS-friendly fonts',
      description: 'Stick to Arial, Calibri, Times New Roman, or similar',
      warning: 'Decorative fonts may not parse correctly',
      completed: false,
    },
    {
      id: 'headers',
      category: 'Sections',
      title: 'Clear section headers',
      description: 'Include: Contact, Summary, Experience, Education, Skills',
      warning: 'Missing key sections reduces ATS score',
      completed: false,
    },
    {
      id: 'length',
      category: 'Length',
      title: 'Keep to 1-2 pages',
      description: 'Concise resumes perform better in ATS systems',
      warning: 'Longer resumes may be truncated by ATS',
      completed: false,
    },
    {
      id: 'dates',
      category: 'Date Format',
      title: 'Use consistent date format',
      description: 'Use MM/YYYY or Month Year format throughout',
      warning: 'Inconsistent dates can confuse parsing',
      completed: false,
    },
    {
      id: 'bullets',
      category: 'Content',
      title: 'Use bullet points',
      description: 'Format achievements as bullet points (- or •)',
      warning: 'Paragraphs are harder for ATS to parse',
      completed: false,
    },
    {
      id: 'keywords',
      category: 'Keywords',
      title: 'Include job keywords',
      description: 'Match keywords from target job descriptions',
      warning: 'Missing keywords reduces match score',
      completed: false,
    },
    {
      id: 'spacing',
      category: 'Spacing',
      title: 'Standard spacing',
      description: 'Use normal margins (0.5-1 inch) and line spacing',
      warning: 'Excessive spacing wastes limited page space',
      completed: false,
    },
    {
      id: 'special-chars',
      category: 'Content',
      title: 'Avoid special formatting',
      description: 'No tables, images, colored text, or icons',
      warning: 'Special formatting may not parse correctly',
      completed: false,
    },
  ]);

  const handleFileSelect = (text: string) => {
    setResumeText(text);
    analyzeResume(text);
  };

  const analyzeResume = (text: string) => {
    setChecklist((prev) =>
      prev.map((item) => {
        let autoDetected = false;

        if (item.id === 'headers') {
          const headers = ['experience', 'education', 'skills', 'summary', 'objective', 'contact'];
          autoDetected = headers.some((h) => text.toLowerCase().includes(h));
        } else if (item.id === 'bullets') {
          const hasBullets = /[-•*]\s+/.test(text);
          autoDetected = hasBullets;
        } else if (item.id === 'keywords') {
          const words = text.trim().split(/\s+/).length;
          autoDetected = words >= 200;
        } else if (item.id === 'single-column') {
          const tabCount = (text.match(/\t/g) || []).length;
          autoDetected = tabCount < 5;
        }

        return {
          ...item,
          autoDetected,
          completed: item.completed || autoDetected,
        };
      })
    );
  };

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  const downloadChecklist = () => {
    const content = `
ResumeIQ - Resume Formatter Checklist
=====================================

Progress: ${completedCount}/${checklist.length} (${progress}%)

${checklist
        .map(
          (item) => `
[${item.completed ? 'X' : ' '}] ${item.title}
Category: ${item.category}
Description: ${item.description}
Status: ${item.completed ? 'Complete' : 'Pending'}
${item.autoDetected ? '(Auto-detected as complete)' : ''}
`
        )
        .join('\n')}

Tips for Optimization:
- Test your resume with ATS scanners
- Use the keyword gap checker to improve match rate
- Keep formatting simple and ATS-friendly
- Focus on content quality and relevance

Generated: ${new Date().toLocaleString()}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', 'resume-checklist.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Checklist downloaded', 'success');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#0b1120] dark:via-[#111827] dark:to-[#0f172a]">

      <div className="max-w-[1700px] mx-auto px-6 lg:px-10 py-10">

        {/* HEADER */}
        <div className="mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md mb-5">
            <Sparkles size={16} className="text-primary" />

            <span className="text-sm font-medium text-primary">
              ATS Resume Formatting Optimizer
            </span>
          </div>

          <h1 className="text-5xl font-black tracking-tight text-dark dark:text-white">
            Resume Formatter
          </h1>

          <p className="mt-4 text-lg text-muted max-w-4xl leading-relaxed">
            Optimize your resume formatting for ATS compatibility,
            recruiter readability, and automated parsing systems.
          </p>
        </div>

        {/* TOP SECTION */}
        <div className="grid xl:grid-cols-[420px_1fr] gap-8 items-start">

          {/* LEFT PANEL */}
          <div className="space-y-6 sticky top-6">

            {/* Upload */}
            <div className="rounded-3xl border border-white/20 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-7">

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
                    Upload PDF, DOCX, or TXT resume
                  </p>
                </div>
              </div>

              <FileDropzone onFileSelect={handleFileSelect} />
            </div>

            {/* Progress */}
            {resumeText && (
              <div className="rounded-3xl border border-white/20 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-7">

                <div className="flex items-center justify-between mb-4">

                  <div>
                    <p className="text-sm text-muted">
                      ATS Optimization Score
                    </p>

                    <h3 className="text-4xl font-black text-dark dark:text-white mt-1">
                      {progress}%
                    </h3>
                  </div>

                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">

                    <Check
                      size={34}
                      className="text-primary"
                    />
                  </div>
                </div>

                <div className="relative h-4 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mb-3">

                  <div
                    className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-primary
                    to-indigo-500
                    transition-all
                    duration-700
                  "
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-sm">

                  <span className="text-muted">
                    {completedCount}/{checklist.length} completed
                  </span>

                  <span className="font-semibold text-primary">
                    ATS Ready
                  </span>
                </div>
              </div>
            )}

            {/* Download */}
            {resumeText && (
              <button
                onClick={downloadChecklist}
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

                Download Checklist
              </button>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">

            {/* CHECKLIST GRID */}
            <div className="grid lg:grid-cols-2 gap-6">

              {checklist.map((item) => (

                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  backdrop-blur-xl
                  shadow-xl
                  p-6
                  cursor-pointer
                  transition-all
                  duration-300
                  hover:scale-[1.01]
                  hover:shadow-2xl
                  ${item.completed
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-white/20 bg-white/70 dark:bg-white/5'
                    }
                `}
                >

                  {/* TOP */}
                  <div className="flex items-start gap-4">

                    {/* CHECK ICON */}
                    <div
                      className={`
                      flex-shrink-0
                      w-12
                      h-12
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      border-2
                      transition-all
                      ${item.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-300 dark:border-white/10 bg-white/60 dark:bg-black/20'
                        }
                    `}
                    >

                      {item.completed ? (
                        <Check size={22} />
                      ) : (
                        <X
                          size={18}
                          className="text-muted"
                        />
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-2 mb-2">

                        <h3
                          className={`
                          text-lg
                          font-bold
                          ${item.completed
                              ? 'text-emerald-500'
                              : 'text-dark dark:text-white'
                            }
                        `}
                        >
                          {item.title}
                        </h3>

                        {item.autoDetected && (
                          <span className="
                          text-xs
                          font-semibold
                          px-3
                          py-1
                          rounded-full
                          bg-primary/10
                          text-primary
                          border
                          border-primary/20
                        ">
                            Auto Detected
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* WARNING */}
                      <div className="
                      rounded-2xl
                      border
                      border-yellow-500/20
                      bg-yellow-500/10
                      p-4
                    ">

                        <div className="flex items-start gap-3">

                          <AlertTriangle
                            size={18}
                            className="text-yellow-500 mt-0.5"
                          />

                          <div>

                            <p className="text-xs font-bold uppercase text-yellow-500 mb-1">
                              Warning
                            </p>

                            <p className="text-sm text-dark dark:text-white leading-relaxed">
                              {item.warning}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* CATEGORY */}
                      <div className="mt-4 flex items-center justify-between">

                        <span className="
                        text-xs
                        font-semibold
                        px-3
                        py-1
                        rounded-full
                        bg-slate-100
                        dark:bg-white/10
                        text-muted
                      ">
                          {item.category}
                        </span>

                        <span
                          className={`
                          text-xs
                          font-bold
                          ${item.completed
                              ? 'text-emerald-500'
                              : 'text-muted'
                            }
                        `}
                        >
                          {item.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* EMPTY STATE */}
            {!resumeText && (
              <div className="
              rounded-3xl
              border
              border-dashed
              border-gray-300
              dark:border-white/10
              bg-white/60
              dark:bg-white/5
              backdrop-blur-xl
              shadow-xl
              min-h-[300px]
              flex
              items-center
              justify-center
              p-10
            ">

                <div className="text-center max-w-xl">

                  <div className="
                  w-24
                  h-24
                  mx-auto
                  mb-6
                  rounded-3xl
                  bg-primary/10
                  flex
                  items-center
                  justify-center
                ">

                    <Sparkles
                      size={42}
                      className="text-primary"
                    />
                  </div>

                  <h3 className="text-3xl font-bold text-dark dark:text-white mb-4">
                    Ready to Optimize
                  </h3>

                  <p className="text-muted leading-relaxed text-lg">
                    Upload your resume to receive ATS formatting analysis,
                    layout validation, readability checks, and recruiter
                    optimization recommendations.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}