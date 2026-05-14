import { AnalysisResult } from '../store/resumeStore';

const ACTION_VERBS = [
  'Led', 'Built', 'Managed', 'Developed', 'Created', 'Analyzed', 'Improved', 'Increased',
  'Designed', 'Implemented', 'Optimized', 'Enhanced', 'Coordinated', 'Supervised',
  'Established', 'Achieved', 'Accomplished', 'Directed', 'Executed', 'Generated',
  'Initiated', 'Launched', 'Organized', 'Partnered', 'Pioneered', 'Produced',
  'Proposed', 'Recognized', 'Resolved', 'Revitalized', 'Spearheaded', 'Streamlined',
  'Strengthened', 'Structured', 'Transformed', 'Transported', 'Unified', 'Updated',
  'Upgraded', 'Utilized', 'Evaluated', 'Exceeded', 'Expanded', 'Expedited',
  'Facilitated', 'Financed', 'Formulated', 'Fostered', 'Founded', 'Gained',
  'Gathered', 'Guided', 'Harnessed', 'Identified', 'Improved', 'Incorporated',
  'Influenced', 'Informed', 'Innovated', 'Instigated', 'Instructed', 'Integrated',
  'Introduced', 'Investigated', 'Invested', 'Involved', 'Joined', 'Justified',
  'Kept', 'Leveraged', 'Maximized', 'Measured', 'Mentored', 'Minimized',
  'Modified', 'Monitored', 'Motivated', 'Navigated', 'Negotiated', 'Obtained',
  'Orchestrated', 'Outlined', 'Overcame', 'Oversaw', 'Participated', 'Perceived',
  'Performed', 'Presented', 'Presided', 'Prevented', 'Prioritized', 'Processed',
];

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'must', 'can', 'that', 'this', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'as', 'if',
  'because', 'while', 'during', 'before', 'after', 'above', 'below', 'between',
  'through', 'into', 'under', 'over', 'about', 'such', 'so', 'very', 'more', 'most',
  'than', 'only', 'own', 'same', 'no', 'not', 'just', 'also', 'even', 'up', 'out',
  'all', 'each', 'every', 'some', 'any', 'other', 'both', 'neither', 'all', 'am',
  'your', 'their', 'our', 'my', 'his', 'her', 'its', 'them', 'us', 'me', 'him',
]);

export function scoreFormat(text: string): { score: number; issues: string[] } {
  let score = 20;
  const issues: string[] = [];

  // Check for excessive tables/tabs
  const tabCount = (text.match(/\t/g) || []).length;
  if (tabCount > 5) {
    score -= 3;
    issues.push('Detected tab characters - may indicate tables or multi-column layout');
  }

  // Check for multiple spaces (often used in columns)
  const multiSpaceCount = (text.match(/  {2,}/g) || []).length;
  if (multiSpaceCount > 10) {
    score -= 3;
    issues.push('Multiple spaces detected - formatting may contain columns');
  }

  // Check for standard section headers
  const sectionHeaders = ['education', 'experience', 'skills', 'summary', 'objective', 'work'];
  const foundHeaders = sectionHeaders.filter((h) => text.toLowerCase().includes(h));
  if (foundHeaders.length < 2) {
    score -= 5;
    issues.push('Missing standard section headers - add Education, Experience, Skills');
  }

  // Check if text is likely scanned (very few words on page)
  const words = text.trim().split(/\s+/).length;
  if (words < 50) {
    score -= 5;
    issues.push('Text appears to be scanned image or very short - resume may not be readable');
  }

  return { score: Math.max(0, score), issues };
}

export function scoreContactInfo(text: string): { score: number; missing: string[] } {
  let score = 10;
  const missing: string[] = [];

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (!emailRegex.test(text)) {
    score -= 3;
    missing.push('Email address');
  }

  const phoneRegex = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
  if (!phoneRegex.test(text)) {
    score -= 3;
    missing.push('Phone number');
  }

  const linkedinRegex = /(linkedin\.com|linkedin)/i;
  if (!linkedinRegex.test(text)) {
    score -= 2;
    missing.push('LinkedIn profile URL');
  }

  const locationRegex = /,\s*[A-Z]{2}|,\s*[A-Z][a-z]+/;
  if (!locationRegex.test(text)) {
    score -= 2;
    missing.push('Location/City');
  }

  return { score: Math.max(0, score), missing };
}

export function scoreKeywords(
  resumeText: string,
  jobDescription: string
): { score: number; matchedKeywords: string[]; missingKeywords: string[] } {
  let score = 0;

  // Fix — return partial credit when no JD
  if (!jobDescription.trim()) {
    return { score: 12, matchedKeywords: [], missingKeywords: [] }; // neutral 50%
  }

  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);

  const matched = jdKeywords.filter((kw) =>
    resumeKeywords.some((rk) => rk === kw || levenshteinDistance(rk, kw) <= 1)
  );
  const missing = jdKeywords.filter((kw) => !matched.includes(kw));

  if (jdKeywords.length > 0) {
    score = Math.round((matched.length / jdKeywords.length) * 25);
  }

  return { score, matchedKeywords: matched, missingKeywords: missing };
}

export function scoreSections(text: string): { score: number; missing: string[] } {
  let score = 20;
  const missing: string[] = [];
  const textLower = text.toLowerCase();

  const sections = {
    'Summary/Objective': ['summary', 'objective', 'profile'],
    'Work Experience': ['experience', 'employment', 'work history'],
    Education: ['education', 'degree', 'university', 'college'],
    Skills: ['skills', 'competencies', 'technical skills'],
    'Certifications/Projects': ['certification', 'projects', 'awards'],
  };

  const foundSections = Object.entries(sections).filter(([, keywords]) =>
    keywords.some((kw) => textLower.includes(kw))
  );

  const points = {
    'Summary/Objective': 4,
    'Work Experience': 5,
    Education: 4,
    Skills: 4,
    'Certifications/Projects': 3,
  };

  score = 0;
  Object.entries(sections).forEach(([name]) => {
    if (foundSections.find(([n]) => n === name)) {
      score += points[name as keyof typeof points];
    } else {
      missing.push(name);
    }
  });

  return { score: Math.min(20, score), missing };
}

export function scoreBulletPoints(text: string): { score: number; count: number; actionVerbs: number } {
  const lines = text.split('\n');
  const bulletRegex = /^[\s]*[-•*◦▪▸→]\s+/;
  const bullets = lines.filter((line) => bulletRegex.test(line.trim()));

  let actionVerbCount = 0;
  bullets.forEach((bullet) => {
    const words = bullet.trim().replace(/^[-•*]\s+/, '').split(/\s+/);
    const firstWord = words[0]?.toLowerCase() || '';
    if (ACTION_VERBS.some((verb) => verb.toLowerCase() === firstWord)) {
      actionVerbCount++;
    }
  });

  let score = 0;
  if (bullets.length > 0) {
    const ratio = actionVerbCount / bullets.length;
    score = Math.round(ratio * 15);
  }

  return { score: Math.min(15, score), count: bullets.length, actionVerbs: actionVerbCount };
}

export function scoreQuantification(text: string): { score: number; count: number } {
  const lines = text.split('\n');
  const bulletRegex = /^[\s]*[-•*]\s+/;
  const bullets = lines.filter((line) => bulletRegex.test(line.trim()));

  const quantRegex = /\d+%|\$[\d,]+|increased by|\d+x|\d+ years?|improved by/i;
  let quantCount = 0;

  bullets.forEach((bullet) => {
    if (quantRegex.test(bullet)) {
      quantCount++;
    }
  });

  let score = 0;
  if (bullets.length > 0) {
    const ratio = quantCount / bullets.length;
    score = Math.round(ratio * 10);
  }

  return { score: Math.min(10, score), count: quantCount };
}

export function analyzeResume(
  resumeText: string,
  jobDescription: string
): { overallScore: number; scores: Record<string, number>; issues: AnalysisResult['issues'] } {
  const format = scoreFormat(resumeText);
  const contact = scoreContactInfo(resumeText);
  const keywords = scoreKeywords(resumeText, jobDescription);
  const sections = scoreSections(resumeText);
  const bullets = scoreBulletPoints(resumeText);
  const quantification = scoreQuantification(resumeText);

  const overallScore = Math.min(100,
    format.score + contact.score + keywords.score +
    sections.score + bullets.score + quantification.score
  );

  const scores = {
    format: format.score,
    contact: contact.score,
    keywords: keywords.score,
    sections: sections.score,
    bullets: bullets.score,
    quantification: quantification.score,
  };

  const issues: AnalysisResult['issues'] = [];

  format.issues.forEach((issue) => {
    issues.push({
      category: 'Format',
      severity: 'error',
      message: issue,
      suggestion: 'Use a single-column layout with standard fonts (Arial, Calibri, Times New Roman)',
    });
  });

  contact.missing.forEach((item) => {
    issues.push({
      category: 'Contact Info',
      severity: 'error',
      message: `Missing: ${item}`,
      suggestion: `Add your ${item} at the top of your resume`,
    });
  });

  if (bullets.count === 0) {
    issues.push({
      category: 'Bullet Points',
      severity: 'error',
      message: 'No bullet points detected',
      suggestion: 'Use bullet points (- or •) to list achievements and responsibilities',
    });
  } else if (bullets.actionVerbs < bullets.count * 0.5) {
    issues.push({
      category: 'Action Verbs',
      severity: 'warning',
      message: `Only ${bullets.actionVerbs}/${bullets.count} bullets start with action verbs`,
      suggestion: `Start each bullet with a strong action verb like: ${ACTION_VERBS.slice(0, 5).join(', ')}`,
    });
  }

  if (quantification.count === 0 && bullets.count > 0) {
    issues.push({
      category: 'Quantification',
      severity: 'warning',
      message: 'No numbers or metrics found in achievements',
      suggestion: 'Add metrics like percentages, dollar amounts, or numbers to quantify impact',
    });
  }

  sections.missing.forEach((section) => {
    issues.push({
      category: 'Sections',
      severity: 'info',
      message: `Missing section: ${section}`,
      suggestion: `Add a "${section}" section to improve ATS compatibility`,
    });
  });

  if (jobDescription.trim() && keywords.missingKeywords.length > 0) {
    const topMissing = keywords.missingKeywords.slice(0, 5).join(', ');
    issues.push({
      category: 'Keywords',
      severity: 'warning',
      message: `Missing ${keywords.missingKeywords.length} job description keywords`,
      suggestion: `Add these keywords naturally: ${topMissing}`,
    });
  }

  return { overallScore, scores, issues };
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+|[-,.()]/);
  return words
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w))
    .map((w) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w) => w.length > 0);
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
      }
    }
  }
  return matrix[b.length][a.length];
}
