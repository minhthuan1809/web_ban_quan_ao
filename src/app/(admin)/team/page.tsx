"use client";
import { addTeam_API, deleteTeam_API, getTeam_API } from "@/app/_service/category";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import useAuthInfor from "@/app/customHooks/AuthInfor";
import { toast } from "react-toastify";
import Loading from "@/app/_util/Loading";
import ModalAddEditTeam from "./ModalAddEditTeam";

export default function Team() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
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
      const response = await getTeam_API(
        searchValue,
        currentPage,
        limit,
        "",
        ""
      );
      
      setTeams(response.data.reverse());
      setTotalPage(response.metadata.total_page);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentPage, limit, refresh, searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeams();
    }, 1000);
    return () => clearTimeout(timer);
  }, [fetchTeams]);

  const handleDeleteTeam = async (id: string) => {
    try {
      setLoadingBtn(true);
      const response: any = await deleteTeam_API(id, accessToken);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Đội Bóng</h1>
        <Button
          className="bg-blue-500 text-white"
          startContent={<Plus size={20} />}
          onPress={() => setIsOpen(true)}
        >
          Thêm đội bóng
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Tìm kiếm đội bóng..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          startContent={<Search size={20} />}
          className="w-80"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loading/>
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
        id={editTeam?.id || ""}
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
