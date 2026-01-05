'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

interface CloudinaryUploadProps {
  folder: 'events' | 'users' | 'courses';
  onUploadSuccess: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  width?: number;
  height?: number;
  buttonText?: string;
}

export default function CloudinaryUpload({
  folder,
  onUploadSuccess,
  currentImage,
  label = 'Upload Image',
  width = 128,
  height = 128,
  buttonText = '📸 Click to upload',
}: CloudinaryUploadProps) {
  const [imagePreview, setImagePreview] = useState<string>(currentImage || '');

  const handleUploadSuccess = (result: any) => {
    const imageUrl = result.info.secure_url;
    setImagePreview(imageUrl);
    onUploadSuccess(imageUrl);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    onUploadSuccess('');
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-4 items-start">
        {/* Image Preview */}
        {imagePreview && (
          <div className="relative rounded-lg overflow-hidden border-2 border-blue-300" style={{ width, height }}>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 text-sm"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex-1">
          <CldUploadWidget
            uploadPreset="studyexpressuk"
            options={{
              folder: `studyexpressuk/${folder}`,
              maxFileSize: 5242880, // 5MB
              clientAllowedFormats: ['image'],
            }}
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-blue-700 font-medium cursor-pointer"
              >
                {buttonText}
              </button>
            )}
          </CldUploadWidget>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP (Max 5MB)</p>
        </div>
      </div>
    </div>
  );
}
