'use client';

import { useState } from 'react';
import { CldUploadWidget, CldImage } from 'next-cloudinary';

interface ImageUploadProps {
  onUploadComplete: (publicId: string) => void;
  onUploadError?: (error: string) => void;
  required?: boolean;
  error?: string;
}

export default function ImageUpload({
  onUploadComplete,
  onUploadError,
  required = false,
  error,
}: ImageUploadProps) {
  const [publicId, setPublicId] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="space-y-2">
      <div
        className={`border-2 rounded-lg  ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result: any) => {
            const info = result?.info;
            if (info?.public_id) {
              setPublicId(info.public_id);
              onUploadComplete(info.public_id);
            } else {
              onUploadError?.('Upload failed: No public_id returned.');
            }
            setIsUploading(false);
          }}
          onError={() => {
            setIsUploading(false);
            onUploadError?.('Image upload failed. Please try again.');
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => {
                setIsUploading(true);
                open();
              }}
              disabled={isUploading}
              className={`w-full py-2 px-4 rounded-md ${
                isUploading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {isUploading
                ? 'Uploading...'
                : publicId
                ? 'Change Resume'
                : 'Upload Resume'}
            </button>
          )}
        </CldUploadWidget>
      </div>

      {publicId && (
        <div className="mt-2">
          <CldImage
            src={publicId}
            width={200}
            height={150}
            alt="Uploaded preview"
            className="rounded-lg"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      {required && !publicId && !error && (
        <p className="text-sm text-gray-500">Image is required</p>
      )}
    </div>
  );
}
