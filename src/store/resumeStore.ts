import { create } from 'zustand';

export interface AnalysisResult {
  id: string;
  timestamp: number;
  resumeText: string;
  jobDescription: string;
  overallScore: number;
  scores: {
    format: number;
    contact: number;
    keywords: number;
    sections: number;
    bullets: number;
    quantification: number;
  };
  issues: Array<{
    category: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion: string;
  }>;
  matchedKeywords: string[];
  missingKeywords: string[];
}

interface ResumeStore {
  currentResume: string;
  currentJobDescription: string;
  darkMode: boolean;
  analysisHistory: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;

  setCurrentResume: (text: string) => void;
  setCurrentJobDescription: (text: string) => void;
  setDarkMode: (enabled: boolean) => void;
  saveAnalysis: (analysis: AnalysisResult) => void;
  removeAnalysis: (id: string) => void;
  clearHistory: () => void;
  getAnalysisById: (id: string) => AnalysisResult | undefined;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
}

const loadHistoryFromLocalStorage = (): AnalysisResult[] => {
  const stored = localStorage.getItem('resumeiq_history');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

const loadDarkModeFromLocalStorage = (): boolean => {
  const stored = localStorage.getItem('resumeiq_darkmode');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return false;
    }
  }
  return false;
};

export const useResumeStore = create<ResumeStore>((set, get) => ({
  currentResume: '',
  currentJobDescription: '',
  darkMode: loadDarkModeFromLocalStorage(),
  analysisHistory: loadHistoryFromLocalStorage(),
  currentAnalysis: null,

  setCurrentResume: (text: string) => set({ currentResume: text }),

  setCurrentJobDescription: (text: string) => set({ currentJobDescription: text }),

  setDarkMode: (enabled: boolean) => {
    localStorage.setItem('resumeiq_darkmode', JSON.stringify(enabled));
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ darkMode: enabled });
  },

  saveAnalysis: (analysis: AnalysisResult) => {
    const history = get().analysisHistory;
    const updatedHistory = [analysis, ...history].slice(0, 20);
    localStorage.setItem('resumeiq_history', JSON.stringify(updatedHistory));
    set({ analysisHistory: updatedHistory });
  },

  removeAnalysis: (id: string) => {
    const history = get().analysisHistory.filter((a) => a.id !== id);
    localStorage.setItem('resumeiq_history', JSON.stringify(history));
    set({ analysisHistory: history });
  },

  clearHistory: () => {
    localStorage.removeItem('resumeiq_history');
    set({ analysisHistory: [] });
  },

  getAnalysisById: (id: string) => {
    return get().analysisHistory.find((a) => a.id === id);
  },

  setCurrentAnalysis: (analysis: AnalysisResult | null) => set({ currentAnalysis: analysis }),
}));
