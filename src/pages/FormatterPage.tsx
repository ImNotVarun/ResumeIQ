import { useState, useEffect } from 'react';
import { Check, X, Download } from 'lucide-react';
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
    <div className="min-h-screen bg-white dark:bg-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-sora font-bold text-dark dark:text-white mb-2">Resume Formatter</h1>
          <p className="text-muted">Optimize your resume formatting for ATS compatibility</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-sora font-semibold text-dark dark:text-white mb-4">Upload Resume</h2>
              <FileDropzone onFileSelect={handleFileSelect} />
            </div>

            {resumeText && (
              <div className="card">
                <p className="text-sm text-muted mb-2">Progress</p>
                <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-success transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-2xl font-sora font-bold text-dark dark:text-white">
                  {completedCount}/{checklist.length}
                </p>
                <p className="text-sm text-muted mt-2">{progress}% complete</p>
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="lg:col-span-2 space-y-4">
            {checklist.map((item, i) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`card cursor-pointer transition-all hover:shadow-md ${
                  item.completed ? 'bg-success/5 dark:bg-success/10' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-success border-success text-white'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                    }`}
                  >
                    {item.completed && <Check size={16} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${item.completed ? 'text-success line-through' : 'text-dark dark:text-white'}`}>
                        {item.title}
                      </h3>
                      {item.autoDetected && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          Auto-detected
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted mb-2">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs bg-warning/10 text-warning px-2 py-1 rounded w-fit border border-warning/30">
                      <span>⚠️</span>
                      <span>{item.warning}</span>
                    </div>
                    <p className="text-xs text-muted mt-2">Category: {item.category}</p>
                  </div>
                </div>
              </div>
            ))}

            {resumeText && (
              <button
                onClick={downloadChecklist}
                className="w-full pill-btn-secondary py-3 flex items-center justify-center gap-2 mt-8"
              >
                <Download size={20} />
                Download Checklist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
