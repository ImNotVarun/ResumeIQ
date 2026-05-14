import { X } from 'lucide-react';

interface KeywordChipProps {
  keyword: string;
  type: 'matched' | 'missing';
  onRemove?: () => void;
  category?: string;
}

export function KeywordChip({ keyword, type, onRemove, category }: KeywordChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
        type === 'matched'
          ? 'bg-success/20 text-success border border-success/30'
          : 'bg-error/20 text-error border border-error/30'
      }`}
      title={category ? `Category: ${category}` : undefined}
    >
      <span>{keyword}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity"
          aria-label="Remove keyword"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
