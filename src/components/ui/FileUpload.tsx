'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from './Button';

interface FileUploadProps {
  value?: string;
  onChange: (base64: string | undefined) => void;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
];

export function FileUpload({ value, onChange, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = value?.startsWith('data:video');

  const handleFile = async (file: File) => {
    setFileError(undefined);

    if (!ACCEPTED_FORMATS.includes(file.type)) {
      setFileError('Formato no válido. Usa JPG, PNG, GIF, WEBP, MP4 o WEBM');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('El archivo es muy grande. Máximo 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.onerror = () => {
      setFileError('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    onChange(undefined);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-grey mb-2">
        Imagen o Video
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-light-grey">
          {isVideo ? (
            <video
              src={value}
              controls
              className="w-full h-48 object-cover"
            />
          ) : (
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          )}
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer',
            isDragging
              ? 'border-secondary bg-secondary/5'
              : 'border-light-grey hover:border-secondary',
          )}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2 text-grey">
              <ImageIcon className="w-8 h-8" />
              <Video className="w-8 h-8" />
            </div>
            <div>
              <p className="font-medium text-primary">
                Arrastra o haz click para subir
              </p>
              <p className="text-sm text-grey mt-1">
                JPG, PNG, GIF, WEBP, MP4, WEBM (máx. 5MB)
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Seleccionar archivo
            </Button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS.join(',')}
        onChange={handleChange}
        className="hidden"
      />

      {(error || fileError) && (
        <p className="mt-1 text-sm text-red-500">{error || fileError}</p>
      )}
    </div>
  );
}