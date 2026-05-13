import React, { useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UploadCloud, X, GripVertical, Link as LinkIcon, Loader2, ImagePlus } from 'lucide-react';

interface ImageUploaderProps {
  /** Array of image URLs (already uploaded or external) */
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  // ── Upload to Supabase Storage ────────────────────────────────────────────
  async function uploadFiles(files: FileList | File[]) {
    setUploadError('');
    const arr = Array.from(files);
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const invalid = arr.filter(f => !allowed.includes(f.type));
    if (invalid.length) {
      setUploadError('Apenas imagens JPG, PNG, WEBP ou GIF são permitidas.');
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of arr) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (error) {
        setUploadError(`Erro ao enviar ${file.name}: ${error.message}`);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  }

  // ── Add URL manually ──────────────────────────────────────────────────────
  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    onChange([...images, url]);
    setUrlInput('');
  }

  // ── Remove image ──────────────────────────────────────────────────────────
  function remove(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  // ── Drag-and-drop reorder ─────────────────────────────────────────────────
  function handleDragStart(idx: number) {
    setDragIndex(idx);
  }

  function handleDragEnter(idx: number) {
    setDropIndex(idx);
  }

  function handleDragEnd() {
    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      const reordered = [...images];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dropIndex, 0, moved);
      onChange(reordered);
    }
    setDragIndex(null);
    setDropIndex(null);
  }

  // ── Drop zone ─────────────────────────────────────────────────────────────
  function handleDropZone(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-4">
      <label className="label-caps text-gray-medium block">
        Imagens do Produto *
        <span className="normal-case text-[10px] text-gray-medium ml-2">
          (arraste para reordenar · primeira = capa)
        </span>
      </label>

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-none transition-colors duration-200 ${
          dragOver ? 'border-gold bg-gold/5' : 'border-gray-light hover:border-gray-medium'
        }`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDropZone}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={e => e.target.files && uploadFiles(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full py-10 flex flex-col items-center gap-3 text-gray-medium hover:text-primary transition-colors disabled:opacity-50"
        >
          {uploading
            ? <Loader2 className="w-8 h-8 animate-spin text-gold" />
            : <UploadCloud className="w-8 h-8" />
          }
          <span className="font-sans text-sm">
            {uploading ? 'Enviando...' : 'Clique ou arraste imagens aqui'}
          </span>
          <span className="font-sans text-xs text-gray-medium">
            JPG, PNG, WEBP ou GIF · máx. 5MB por arquivo
          </span>
        </button>
      </div>

      {uploadError && (
        <p className="font-sans text-xs text-red-500 flex items-center gap-1.5">
          <X className="w-3 h-3" /> {uploadError}
        </p>
      )}

      {/* Add by URL */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-medium" />
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="Ou cole uma URL de imagem externa..."
            className="w-full border border-gray-light pl-10 pr-4 py-3 font-sans text-sm bg-offwhite outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          className="px-5 py-3 border border-gray-light text-primary font-sans text-xs uppercase tracking-widest hover:border-primary hover:bg-primary hover:text-secondary transition-colors flex items-center gap-2"
        >
          <ImagePlus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Image Gallery / Reorder */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div
              key={url + idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragEnter={() => handleDragEnter(idx)}
              onDragEnd={handleDragEnd}
              className={`relative group border-2 transition-all duration-150 cursor-grab active:cursor-grabbing ${
                dropIndex === idx && dragIndex !== idx
                  ? 'border-gold scale-105'
                  : idx === 0
                  ? 'border-primary'
                  : 'border-gray-light'
              }`}
            >
              {/* Cover badge */}
              {idx === 0 && (
                <span className="absolute top-1.5 left-1.5 z-10 bg-primary text-secondary font-sans text-[9px] uppercase tracking-widest px-2 py-0.5">
                  Capa
                </span>
              )}

              {/* Drag handle */}
              <div className="absolute top-1.5 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity text-secondary drop-shadow">
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute top-1.5 right-1.5 z-10 w-6 h-6 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="aspect-square bg-offwhite overflow-hidden">
                <img
                  src={url}
                  alt={`Imagem ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23eee" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="12">Erro</text></svg>';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
