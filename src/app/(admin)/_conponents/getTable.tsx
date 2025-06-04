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

export default function getTable(
  data: any,
  handleDelete: (id: string) => void,
  handleEdit: (item: any) => void,
  totalPage: number,
  currentPage: number,
  setCurrentPage: (page: number) => void,
  title: string
) {
  return (
    <div className="flex flex-col gap-4">
      <Table
        aria-label={`Bảng ${title}`}
        className="min-h-[400px]"
      >
        <TableHeader>
          <TableColumn className="text-center">STT</TableColumn>
          <TableColumn className="text-center">TÊN</TableColumn>
          <TableColumn className="text-center">THAO TÁC</TableColumn>
        </TableHeader>
        <TableBody
          items={data}
          emptyContent={data.length === 0 && "Không có dữ liệu"}
        >
          {(item: any) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">{data.indexOf(item) + 1}</TableCell>
              <TableCell className="text-center">{item.name}</TableCell>
              <TableCell className="flex justify-center">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-500 text-white"
                    startContent={<Pencil size={16} />}
                    onPress={() => handleEdit(item)}
                  ></Button>
                  <Button
                    size="sm"
                    className="bg-red-500 text-white"
                    startContent={<Trash2 size={16} />}
                    onPress={() => handleDelete(item.id)}
                  ></Button>
                </div>
              </TableCell>
            </TableRow>
          )}
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
