import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface InputTakeImgProps {
  onChange: (value: (File | string)[]) => void;
  numberImg: number;
  images: (File | string)[];
  setImages: (value: (File | string)[]) => void;
}

export default function InputTakeImg({
  onChange,
  images,
  setImages,
  numberImg = 1,
}: InputTakeImgProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string>('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);


  console.log("images", images);

  // Update preview URLs when images change
  useEffect(() => {
    const generatePreviews = async () => {
      const urls = await Promise.all(
        images.map((file) => {
          if (typeof file === 'string') {
            return file;
          }
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(file as File);
          });
        })
      );
      setPreviewUrls(urls);
    };

    generatePreviews();
  }, [images]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length + images.length > numberImg) {
        toast.error(`Chỉ được chọn tối đa ${numberImg} ảnh`);
        return;
      }

      const newFiles = Array.from(files);
      const updatedImages = [...images, ...newFiles];
      setImages(updatedImages);
      onChange(updatedImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(newImages);
  };

  const handlePreviewImage = (previewUrl: string) => {
    setSelectedPreviewImage(previewUrl);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-6 items-center">
        {images.length < numberImg && (
          <label className="w-[120px] h-[120px] bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-transform hover:scale-105 cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />
            <div className="w-full h-full flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs text-gray-500 mt-2">Thêm ảnh ({images.length}/{numberImg})</span>
            </div>
          </label>
        )}

        {previewUrls.map((previewUrl, index) => (
          <div key={index} className="relative w-[120px] h-[120px]">
            <Image
              src={previewUrl}
              alt={`Preview ${index + 1}`}
              width={120}
              height={120}
              className="w-full h-full object-cover rounded-lg cursor-pointer"
              onClick={() => handlePreviewImage(previewUrl)}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative bg-white rounded-xl z-10 w-[90vw] max-w-[1200px] h-[80vh] overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={selectedPreviewImage || '/placeholder-image.jpg'}
                alt="Full size preview"
                fill
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
