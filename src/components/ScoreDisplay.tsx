import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScoreDisplayProps {
  overallScore: number;
  scores: {
    format: number;
    contact: number;
    keywords: number;
    sections: number;
    bullets: number;
    quantification: number;
  };
}

export function ScoreDisplay({ overallScore, scores }: ScoreDisplayProps) {
  const scoreCategories = [
    { name: 'Format', value: scores.format, maxValue: 20 },
    { name: 'Contact Info', value: scores.contact, maxValue: 10 },
    { name: 'Keywords', value: scores.keywords, maxValue: 25 },
    { name: 'Sections', value: scores.sections, maxValue: 20 },
    { name: 'Bullets', value: scores.bullets, maxValue: 15 },
    { name: 'Quantification', value: scores.quantification, maxValue: 10 },
  ];

  const donutData = [
    { name: 'Score', value: overallScore },
    { name: 'Remaining', value: 100 - overallScore },
  ];

  const barData = scoreCategories.map((cat) => ({
    name: cat.name,
    value: Math.round((cat.value / cat.maxValue) * 100),
    actual: cat.value,
  }));

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <p className="text-sm text-muted mb-2">Overall ATS Score</p>
        <div className="flex justify-center mb-4">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={donutData}
                cx={100}
                cy={100}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill={getScoreColor(overallScore)} />
                <Cell fill="#E5E7EB" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-5xl font-sora font-bold text-dark dark:text-white mb-2">
          {overallScore}
        </div>
        <p className={`text-lg font-semibold ${
          overallScore >= 80
            ? 'text-success'
            : overallScore >= 60
              ? 'text-warning'
              : 'text-error'
        }`}>
          {overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Good' : 'Needs Improvement'}
        </p>
      </div>

      <div className="card">
        <h3 className="font-sora font-semibold text-dark dark:text-white mb-4">Score Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'value') return [`${value}%`, 'Percentage'];
                return value;
              }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="value" fill="#F5C842" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
