import {
  Table,
  TableBody,
  TableHeader,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Pagination,
} from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";

interface RenderTableProps {
  data: Array<{
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  }>;
  handleDelete: (id: string) => void;
  handleEdit: (item: any) => void;
  totalPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  title: string;
}

export default function RenderTable({
  data,
  handleDelete,
  handleEdit,
  totalPage,
  currentPage,
  setCurrentPage,
  title
}: RenderTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <Table
        aria-label={`Bảng ${title}`}
        className="min-h-[400px]"
      >
        <TableHeader>
          <TableColumn className="text-center">STT</TableColumn>
          <TableColumn className="text-center">TÊN</TableColumn>
          <TableColumn className="text-center">NGÀY TẠO</TableColumn>
          <TableColumn className="text-center">NGÀY CẬP NHẬT</TableColumn>
          <TableColumn className="text-center">TRẠNG THÁI</TableColumn>
          <TableColumn className="text-center">THAO TÁC</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={data.length === 0 ? "Không có dữ liệu" : null}
        >
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="text-center">{item.name}</TableCell>
              <TableCell className="text-center">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell className="text-center">{new Date(item.updatedAt).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell className="text-center">{item.isDeleted ? 'Đã xóa' : 'Hoạt động'}</TableCell>
              <TableCell className="flex justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-500 text-white"
                    startContent={<Pencil size={16} />}
                    onPress={() => handleEdit(item)}
                    isDisabled={item.isDeleted}
                  ></Button>
                  <Button
                    size="sm"
                    className="bg-red-500 text-white"
                    startContent={<Trash2 size={16} />}
                    onPress={() => handleDelete(item.id.toString())}
                    isDisabled={item.isDeleted}
                  ></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPage > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPage}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            variant="bordered"
            classNames={{
              wrapper: "gap-2",
              item: "w-8 h-8 text-sm rounded-lg",
              cursor: "bg-blue-500 text-white font-bold",
            }}
          />
        </div>
      )}
    </div>
  );
}
