"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (url: string) => void;
  uploadEndpoint: '/api/upload/profile-image' | '/api/upload/cover-image';
  label: string;
  aspectRatio?: 'square' | 'wide';
}

export default function ImageUpload({
  currentImage,
  onImageChange,
  uploadEndpoint,
  label,
  aspectRatio = 'square'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      onImageChange(data.url);
      setPreviewUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreviewUrl(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 'aspect-video';
  const previewHeight = aspectRatio === 'square' ? 'h-64' : 'h-48';

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {previewUrl ? (
        <div className="space-y-3">
          <div className={`relative ${previewHeight} w-full max-w-md rounded-lg overflow-hidden border-2 border-gray-200`}>
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-sm">Uploading...</div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative ${aspectClass} ${previewHeight} w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors flex items-center justify-center bg-gray-50`}
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to {uploadEndpoint.includes('profile') ? '5MB' : '10MB'}</p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {uploading && (
        <div className="text-blue-600 text-sm">
          Uploading to Vercel Blob storage...
        </div>
      )}
    </div>
  );
}
