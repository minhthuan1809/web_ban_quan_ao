import { Spinner } from "@nextui-org/react";
import React, { use, useEffect } from "react";

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
    <div>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div className="bg-white rounded-lg p-6 z-10 w-[576px]">
          <div className="flex flex-col gap-1 mb-4">
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 ">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {titleInput}
                </label>
                <input
                  type="text"
                  placeholder={`Nhập ${titleInput}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleFinish}
              disabled={loadingBtn || name.trim() === ""}
            >
              {loadingBtn ? <Spinner size="sm" /> : dataEdit ? "Sửa" : "Thêm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
