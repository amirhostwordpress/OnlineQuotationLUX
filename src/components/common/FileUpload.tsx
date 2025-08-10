import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  acceptedTypes?: string;
  maxSize?: number;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  acceptedTypes = 'image/*,.pdf',
  maxSize = 3 * 1024 * 1024, // 3MB
  label = 'Click to upload file'
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.split(',').reduce((acc, type) => ({
      ...acc,
      [type.trim()]: []
    }), {}),
    maxSize,
    multiple: false
  });

  const removeFile = () => {
    onFileSelect(null);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={24} className="text-blue-600" />;
    }
    return <FileText size={24} className="text-red-600" />;
  };

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 font-medium mb-2">{label}</p>
          <p className="text-sm text-gray-500">
            Accepted file types: JPG, JPEG, GIF, PNG, PDF
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Maximum file size: 3MB
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-3">
            {getFileIcon(selectedFile)}
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;