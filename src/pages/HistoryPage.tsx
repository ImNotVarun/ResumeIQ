import { useMemo, useState } from 'react';
import { Trash2, BarChart3 } from 'lucide-react';
import { useResumeStore, AnalysisResult } from '../store/resumeStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { showToast } from '../components/Toast';

export function HistoryPage() {
  const { analysisHistory, removeAnalysis, clearHistory } = useResumeStore();
  const [selectedPair, setSelectedPair] = useState<[string, string] | null>(null);

  const chartData = useMemo(() => {
    return analysisHistory
      .slice()
      .reverse()
      .map((analysis, i) => ({
        index: i + 1,
        score: analysis.overallScore,
        timestamp: new Date(analysis.timestamp).toLocaleDateString(),
        id: analysis.id,
      }));
  }, [analysisHistory]);

  const getSelectedAnalyses = (): [AnalysisResult, AnalysisResult] | null => {
    if (!selectedPair) return null;
    const [id1, id2] = selectedPair;
    const a1 = analysisHistory.find((a) => a.id === id1);
    const a2 = analysisHistory.find((a) => a.id === id2);
    return a1 && a2 ? [a1, a2] : null;
  };

  const comparison = getSelectedAnalyses();

  if (analysisHistory.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark flex items-center justify-center">
        <div className="text-center">
          <BarChart3 size={64} className="mx-auto text-muted mb-4 opacity-50" />
          <h1 className="text-3xl font-sora font-bold text-dark dark:text-white mb-2">No Analysis History</h1>
          <p className="text-muted mb-6">Run your first analysis to see your score history and trends.</p>
          <a href="/analyze" className="pill-btn-primary">
            Start Analyzing
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-sora font-bold text-dark dark:text-white mb-2">Score History</h1>
            <p className="text-muted">{analysisHistory.length} analyses saved</p>
          </div>
          <button
            onClick={() => {
              clearHistory();
              showToast('History cleared', 'success');
            }}
            className="pill-btn-ghost text-sm"
          >
            Clear All
          </button>
        </div>

        {/* Score Trend Chart */}
        <div className="card mb-8">
          <h2 className="font-sora font-semibold text-dark dark:text-white mb-6">Score Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="index" label={{ value: 'Analysis #', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
              <Tooltip
                formatter={(value) => `${value}/100`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#F5C842"
                strokeWidth={3}
                dot={{ fill: '#F5C842', r: 5 }}
                activeDot={{ r: 7 }}
                name="ATS Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* History List */}
          <div className="lg:col-span-1">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analysisHistory.map((analysis) => (
                <div
                  key={analysis.id}
                  className={`card cursor-pointer transition-all ${selectedPair?.includes(analysis.id) ? 'ring-2 ring-primary' : ''
                    }`}
                  onClick={() => {
                    if (selectedPair) {
                      if (selectedPair[0] === analysis.id) {
                        setSelectedPair(null);
                      } else {
                        setSelectedPair([selectedPair[0], analysis.id]);
                      }
                    } else {
                      setSelectedPair([analysis.id, '']);
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-sora font-bold text-primary">{analysis.overallScore}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAnalysis(analysis.id);
                        showToast('Analysis removed', 'success');
                        setSelectedPair(null);
                      }}
                      className="p-2 hover:bg-error/10 rounded-lg transition-colors text-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-muted">{new Date(analysis.timestamp).toLocaleDateString()}</p>
                  <p className="text-xs text-muted mt-1 truncate">
                    {analysis.jobDescription.substring(0, 30)}...
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison View */}
          <div className="lg:col-span-2">
            {comparison ? (
              <div className="space-y-6">
                <h2 className="font-sora font-bold text-dark dark:text-white text-xl">Comparison</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {[comparison[0], comparison[1]].map((analysis, idx) => (
                    <div key={idx} className="card">
                      <p className="text-xs text-muted mb-2">Analysis #{analysisHistory.indexOf(analysis) + 1}</p>
                      <div className="text-4xl font-sora font-bold text-primary mb-4">{analysis.overallScore}</div>
                      <p className="text-xs text-muted mb-4">{new Date(analysis.timestamp).toLocaleString()}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Format</span>
                          <span className="font-semibold text-dark dark:text-white">{analysis.scores.format}/20</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Contact</span>
                          <span className="font-semibold text-dark dark:text-white">{analysis.scores.contact}/10</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Keywords</span>
                          <span className="font-semibold text-dark dark:text-white">{analysis.scores.keywords}/25</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Sections</span>
                          <span className="font-semibold text-dark dark:text-white">{analysis.scores.sections}/20</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Bullets</span>
                          <span className="font-semibold text-dark dark:text-white">{analysis.scores.bullets}/15</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted">Quantification</span>
                          <span className="font-semibold text-dark dark:text-white">{analysis.scores.quantification}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Improvement Summary */}
                <div className="card bg-success/5 border border-success/30">
                  <h3 className="font-semibold text-dark dark:text-white mb-3">Improvement</h3>
                  <p className="text-sm text-dark dark:text-white mb-3">
                    Score change: <span className={comparison[1].overallScore > comparison[0].overallScore ? 'text-success' : 'text-error'}>
                      {comparison[1].overallScore > comparison[0].overallScore ? '+' : ''}
                      {comparison[1].overallScore - comparison[0].overallScore}
                    </span>
                  </p>
                  <div className="space-y-2 text-xs">
                    {Object.entries(comparison[1].scores).map(([key, value]) => {
                      const oldValue = (comparison[0].scores as Record<string, number>)[key];
                      const diff = value - oldValue;
                      return (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted capitalize">{key}</span>
                          <span className={diff > 0 ? 'text-success' : diff < 0 ? 'text-error' : 'text-muted'}>
                            {diff > 0 ? '+' : ''}{diff}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card h-96 flex items-center justify-center text-center">
                <div>
                  <p className="text-muted mb-2">Select two analyses to compare</p>
                  <p className="text-sm text-muted">Click on analyses in the list to compare scores and improvements</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
