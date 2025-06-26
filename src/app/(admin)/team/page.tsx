"use client";
import { addTeam_API, deleteTeam_API, getTeam_API } from "@/app/_service/category";
import type { Team } from '@/types/product';
import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { toast } from "react-toastify";
import Loading from "@/app/_util/Loading";
import ModalAddEditTeam from "./ModalAddEditTeam";
import showConfirmDialog from "@/app/_util/Sweetalert2";
import { TeamSkeleton } from "../_skeleton";
import { useAdminSearchStore } from '@/app/_zustand/admin/SearchStore';

export default function Team() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
=======
  const [currentPage, setCurrentPage] = useState(1);
  const { search: searchValue, type: searchType, setType, setSearch } = useAdminSearchStore();
>>>>>>> f0c633c967f0243bc80136c41a5c34cb4db6afa3
  const limit = 10;
  const [isOpen, setIsOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editTeam, setEditTeam] = useState<any>(null);
  const [totalPage, setTotalPage] = useState(10);

  const [name, setName] = useState("");
  const [league, setLeague] = useState("");
  const [country, setCountry] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const { accessToken } = useAuthInfor();

  const fetchTeams = useCallback(async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const response = await getTeam_API({
        search: searchValue,
        page: currentPage,
        pageSize: limit,
        sort: "createdAt:desc",
        filter: ""
      });
      // Đảm bảo id là string cho đồng bộ
      const teamsData = (response.data as any[]).map((team) => ({
        ...team,
        id: typeof team.id === 'number' ? String(team.id) : team.id
      }));
      setTeams(teamsData.reverse());
      setTotalPage(response.pagination?.totalPages || 1);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentPage, limit, refresh, searchValue]);

  // Set type khi vào trang team
  useEffect(() => {
    setType('team');
  }, [setType]);

  // debounce search
  useEffect(() => {
    if (searchType === 'team' || searchType === '') {
      const timer = setTimeout(() => {
        fetchTeams();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [fetchTeams, searchValue, searchType]);

  const handleDeleteTeam = async (id: string) => {
    const result = await showConfirmDialog({
      title: 'Xác nhận xóa?',
      text: `Bạn có chắc chắn muốn xóa đội bóng này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    })  
    if (result.isConfirmed) {
    try {
      setLoadingBtn(true);
      const response: any = await deleteTeam_API(id || "", accessToken || "");
      if (response.status === 204) {
        toast.success("Xóa đội bóng thành công");
        setRefresh(!refresh);
      } else {
        toast.error("Xóa đội bóng thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa đội bóng");
    } finally {
          setLoadingBtn(false);
      }
    }
  }

  const handleEditTeam = (team: any) => {
    setEditTeam(team);
    setName(team.name);
    setLeague(team.league);
    setCountry(team.country); 
    setLogoUrl(team.logoUrl);
    setIsOpen(true);
  }

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border mb-4 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            color="primary"
            className="h-[40px] font-medium w-full sm:w-auto"
            startContent={<Plus size={18} />}
            onClick={() => {
              setIsOpen(true)
              setEditTeam(null)
              setName("")
            }}
          >
            Thêm đội bóng
          </Button>
        </div>
      </div>

      {loading ? (
        <TeamSkeleton />
      ) : teams.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">Không có dữ liệu</p>
        </div>
      ) : (
        <Table aria-label="Bảng đội bóng" className="min-h-[400px]">
          <TableHeader>
            <TableColumn className="text-center">STT</TableColumn>
            <TableColumn className="text-center">TÊN ĐỘI BÓNG</TableColumn>
            <TableColumn className="text-center">GIẢI ĐẤU</TableColumn>
            <TableColumn className="text-center">QUỐC GIA</TableColumn>
            <TableColumn className="text-center">LOGO</TableColumn>
            <TableColumn className="text-center">THAO TÁC</TableColumn>
          </TableHeader>
          <TableBody>
            {teams.map((team: any, index) => (
              <TableRow key={team.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="text-center">{team.name}</TableCell>
                <TableCell className="text-center">{team.league}</TableCell>
                <TableCell className="text-center">{team.country}</TableCell>
                <TableCell className="text-center">
                  <img src={team.logoUrl} alt={team.name} className="w-10 h-10 mx-auto"/>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-500 text-white"
                      startContent={<Pencil size={16} />}
                      onPress={() => handleEditTeam(team)}
                    />
                    <Button
                      size="sm"
                      className="bg-red-500 text-white"
                      startContent={<Trash2 size={16} />}
                      onPress={() => handleDeleteTeam(team.id)}
                      isLoading={loadingBtn}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ModalAddEditTeam
        id={editTeam && editTeam.id != null ? String(editTeam.id) : ""}
        form={{
          name,
          league,
          country,
          logoUrl,
          setName,
          setLeague,
          setCountry,
          setLogoUrl
        }}
        onClose={() => {
          setIsOpen(false);
          setEditTeam(null);
          setName("");
          setLeague("");
          setCountry("");
          setLogoUrl("");
        }}
        open={isOpen}
      />
    </div>
  );
}
