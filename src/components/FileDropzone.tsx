import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { extractTextFromFile } from '../lib/textExtractor';
import { showToast } from './Toast';

interface FileDropzoneProps {
  onFileSelect: (text: string) => void;
  loading?: boolean;
}

export function FileDropzone({ onFileSelect, loading = false }: FileDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      try {
        const text = await extractTextFromFile(file);
        if (text.trim().length === 0) {
          showToast('File appears to be empty', 'error');
          return;
        }
        setSelectedFile(file);
        onFileSelect(text);
        showToast('Resume uploaded successfully', 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Failed to read file', 'error');
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    disabled: loading,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.pdf')) return '📄';
    if (name.endsWith('.docx')) return '📝';
    return '📃';
  };

  // Show file preview after upload
  if (selectedFile) {
    return (
      <div className="border-2 border-green-400 bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 transition-all">
        <div className="flex items-center gap-4">
          {/* File icon */}
          <div className="p-3 bg-green-100 dark:bg-green-800/40 rounded-xl text-2xl shrink-0">
            {getFileIcon(selectedFile.name)}
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle size={16} className="text-green-500 shrink-0" />
              <p className="font-semibold text-dark dark:text-white text-sm truncate">
                {selectedFile.name}
              </p>
            </div>
            <p className="text-xs text-muted">
              {formatFileSize(selectedFile.size)} · {selectedFile.name.split('.').pop()?.toUpperCase()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
              ✓ Text extracted successfully
            </p>
          </div>

          {/* Remove + replace */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={removeFile}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-500"
              title="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Replace file option */}
        <div
          {...getRootProps()}
          className="mt-4 text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p className="text-xs text-muted hover:text-primary transition-colors underline underline-offset-2">
            Replace with a different file
          </p>
        </div>
      </div>
    );
  }

  // Default dropzone
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragActive
        ? 'border-primary bg-primary/10 scale-105'
        : 'border-gray-300 dark:border-gray-600 hover:border-primary'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="p-4 bg-primary/10 rounded-full w-fit">
          {isDragActive ? (
            <FileText className="text-primary" size={28} />
          ) : (
            <Upload className="text-primary" size={28} />
          )}
        </div>
        <div>
          <p className="font-semibold text-dark dark:text-white">
            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
          </p>
          <p className="text-sm text-muted">or click to select (PDF, DOCX, TXT)</p>
        </div>
      </div>
    </div>
  );
}