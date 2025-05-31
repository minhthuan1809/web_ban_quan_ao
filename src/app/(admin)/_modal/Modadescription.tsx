import RenderTextEditer from "@/app/_util/ui/RenderTextEditer";
import { X } from "lucide-react";
import React from "react";

interface ModadescriptionProps {
  description: string;
  onClose: () => void;
}

export default function Modadescription({
  description,
  onClose,
}: ModadescriptionProps) {
  if (!description) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-gray-800">
              Chi tiết mô tả sản phẩm
            </h4>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 overflow-y-auto custom-scrollbar" style={{maxHeight: "calc(85vh - 70px)"}}>
          <div className="prose prose-sm max-w-none">
            <RenderTextEditer value={description} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}
