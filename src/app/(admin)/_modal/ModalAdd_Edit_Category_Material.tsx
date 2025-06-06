"use client";

import { Spinner } from "@nextui-org/react";
import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function ModalAdd_Edit_Category_Material({
  isOpen,
  onClose,
  title,
  titleInput,
  name,
  setName,
  handleFinish,
  loadingBtn,
  dataEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleInput: string;
  name: string;
  setName: (name: string) => void;
  handleFinish: () => void;
  loadingBtn: boolean;
  dataEdit: any;
}) {
  useEffect(() => {
    if (dataEdit) {
      setName(dataEdit.name);
    }
  }, [dataEdit]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-card rounded-xl p-6 z-10 w-[500px] shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors duration-200 text-muted-foreground hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                {titleInput}
              </label>
              <input
                type="text"
                placeholder={`Nhập ${titleInput}...`}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-foreground"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleFinish}
            disabled={loadingBtn || name.trim() === ""}
          >
            {loadingBtn ? (
              <>
                <Spinner size="sm" color="white" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              dataEdit ? "Sửa" : "Thêm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
