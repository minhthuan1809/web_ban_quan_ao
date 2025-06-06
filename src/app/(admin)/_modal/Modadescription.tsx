"use client";

import { X } from "lucide-react";
import RenderTextEditer from "@/app/_util/ui/RenderTextEditer";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-foreground">
              Chi tiết mô tả sản phẩm
            </h4>
            <button
              className="p-2 hover:bg-primary/10 rounded-full transition-colors duration-200 text-muted-foreground hover:text-primary"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar" style={{maxHeight: "calc(85vh - 70px)"}}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <RenderTextEditer value={description} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          @apply bg-background rounded;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          @apply bg-border rounded hover:bg-muted transition-colors;
        }
      `}</style>
    </div>
  );
}
