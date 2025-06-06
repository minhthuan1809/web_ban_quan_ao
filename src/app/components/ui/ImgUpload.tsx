import React, { useState } from 'react'
import { Upload } from 'lucide-react'

    export default function ImgUpload({ setPreview , preview, setFile }: any) {

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(file)
    if (setFile) setFile(file)
  }

  return (
    <div className="w-full h-full">
      <label className="flex flex-col items-center justify-center w-full h-full border-2 border-border border-dashed rounded-lg cursor-pointer bg-default-50 hover:bg-default-100 transition-colors">
        <div className="flex flex-col items-center justify-center w-full h-full">
          {preview ? (
            <img 
              src={preview instanceof File ? URL.createObjectURL(preview) : preview} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <>
              <Upload className="w-8 h-8 mb-4 text-default-500" />
              <p className="mb-2 text-sm text-default-600">
                <span className="font-semibold">Click để tải ảnh lên</span>
              </p>
              <p className="text-xs text-default-500">SVG, PNG, JPG hoặc GIF</p>
            </>
          )}
        </div>
        <input 
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
    </div>
  )
}
