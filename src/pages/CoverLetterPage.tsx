import { useState } from 'react';
import { Copy, Download } from 'lucide-react';
import { showToast } from '../components/Toast';

const TEMPLATES = {
  professional: `Dear {{company_name}} Hiring Manager,

I am writing to express my strong interest in the {{job_title}} position. With {{years}} years of professional experience in {{skills}}, I am confident in my ability to contribute significantly to your team.

Throughout my career, I have developed expertise in {{skills}}, and I am particularly drawn to this opportunity because of your company's commitment to excellence. My background has equipped me with the skills necessary to excel in this role, and I am excited about the prospect of bringing my experience to {{company_name}}.

I am confident that my technical abilities, coupled with my dedication to delivering high-quality results, make me an ideal candidate for this position. I would welcome the opportunity to discuss how my experience aligns with your team's needs.

Thank you for considering my application. I look forward to the opportunity to speak with you further.

Sincerely,
{{your_name}}`,

  enthusiastic: `Hi {{company_name}} Team,

I am thrilled to apply for the {{job_title}} position! With {{years}} years of hands-on experience in {{skills}}, I'm excited about the opportunity to bring my passion and expertise to your innovative team.

I've been following {{company_name}}'s work and I'm genuinely impressed by your impact in the industry. Your commitment to excellence aligns perfectly with my professional values, and I'm confident that my skills in {{skills}} will enable me to make a meaningful contribution from day one.

What excites me most about this role is the opportunity to work on challenging projects while continuing to grow professionally. I'm ready to hit the ground running and deliver exceptional results for your team.

I'd love to discuss how I can contribute to {{company_name}}'s continued success. Thank you for your time and consideration!

Best regards,
{{your_name}}`,

  concise: `Dear {{company_name}} Hiring Team,

I am interested in the {{job_title}} role. With {{years}} years of experience in {{skills}}, I am well-positioned to contribute to your team immediately.

My expertise in {{skills}} directly aligns with the requirements of this position. I am confident I can deliver strong results and support your team's objectives.

I am available for a conversation at your convenience.

Thank you,
{{your_name}}`,
};

export function CoverLetterPage() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    name: '',
    skills: '',
    years: '',
  });

  const [template, setTemplate] = useState<'professional' | 'enthusiastic' | 'concise'>('professional');
  const [coverLetter, setCoverLetter] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateLetter = () => {
    if (!formData.jobTitle || !formData.company || !formData.name || !formData.skills || !formData.years) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    let letter = TEMPLATES[template]
      .replace(/{{job_title}}/g, formData.jobTitle)
      .replace(/{{company_name}}/g, formData.company)
      .replace(/{{your_name}}/g, formData.name)
      .replace(/{{skills}}/g, formData.skills)
      .replace(/{{years}}/g, formData.years);

    setCoverLetter(letter);
    setWordCount(letter.split(/\s+/).length);
    showToast('Cover letter generated', 'success');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const downloadLetter = () => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(coverLetter)}`);
    element.setAttribute('download', `cover-letter-${formData.company}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Cover letter downloaded', 'success');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-sora font-bold text-dark dark:text-white mb-2">Cover Letter Helper</h1>
          <p className="text-muted">Generate professional cover letters tailored to job descriptions</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Senior Product Manager"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-light-dark text-dark dark:text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g., TechCorp Inc"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-light-dark text-dark dark:text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., John Smith"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-light-dark text-dark dark:text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">Years of Experience</label>
              <input
                type="text"
                name="years"
                value={formData.years}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-light-dark text-dark dark:text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">Key Skills (comma separated)</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., Product Strategy, Data Analysis, Team Leadership"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-light-dark text-dark dark:text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-dark dark:text-white mb-2">Tone / Template</label>
              <div className="space-y-2">
                {(['professional', 'enthusiastic', 'concise'] as const).map((tone) => (
                  <label key={tone} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      value={tone}
                      checked={template === tone}
                      onChange={() => setTemplate(tone)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-dark dark:text-white capitalize">{tone}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={generateLetter} className="w-full pill-btn-primary py-4 text-lg font-semibold">
              Generate Cover Letter
            </button>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            {coverLetter ? (
              <>
                <div className="card">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-muted mb-2">Word Count</p>
                      <p className="text-3xl font-sora font-bold text-dark dark:text-white">{wordCount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted mb-2">Character Count</p>
                      <p className="text-lg font-semibold text-dark dark:text-white">{coverLetter.length}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted">
                    Ideal length: 250-400 words | Current: {wordCount < 250 ? 'Too short' : wordCount > 400 ? 'Long' : 'Optimal'}
                  </p>
                </div>

                <div className="card">
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm text-dark dark:text-white leading-relaxed">{coverLetter}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={copyToClipboard} className="flex-1 pill-btn-secondary py-3 flex items-center justify-center gap-2">
                    <Copy size={20} />
                    Copy
                  </button>
                  <button onClick={downloadLetter} className="flex-1 pill-btn-secondary py-3 flex items-center justify-center gap-2">
                    <Download size={20} />
                    Download
                  </button>
                </div>
              </>
            ) : (
              <div className="card h-96 flex items-center justify-center text-center">
                <div>
                  <p className="text-muted mb-2">Fill in your details and click "Generate"</p>
                  <p className="text-sm text-muted">Your cover letter will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
