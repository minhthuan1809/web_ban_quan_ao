'use client';

import { getTeam_API } from '@/app/_service/category';
import { Input } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function InputCategoryteam({
  setTeam,
  team
}: {
  setTeam: (value: string) => void;
  team: string;
}) {        
    const { accessToken } = useAuthInfor();
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [teams, setTeams] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const fetchTeams = useCallback(async () => {
        if (!accessToken) return;
        try {
          setLoading(true);
          const search = typeof searchValue === 'string' ? searchValue : '';
          const response = await getTeam_API({
            search,
            page: currentPage,
            pageSize: limit,
            sort: "createdAt:desc",
            filter: ""
          });
          setTeams(response.data.reverse());
        } catch (err: any) {
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      }, [accessToken, currentPage, limit, searchValue]);

    useEffect(() => {
      if (mounted) {
        fetchTeams();
      }
    }, [fetchTeams, mounted]);

    useEffect(() => {
      // Set selected team when team prop changes
      if (mounted && team && teams.length > 0) {
        const foundTeam = teams.find((t: any) => t.id?.toString() === team);
        if (foundTeam) {
          setSelectedTeam(foundTeam);
        } else {
          setSelectedTeam(null);
        }
      }
    }, [team, teams, mounted]);

    const handleSelectTeam = (team: any) => {
      setSelectedTeam(team);
      setTeam(team.id.toString());
      setShowDropdown(false);
      setSearchValue("");
    }

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    }

    const handleBlur = () => {
      setTimeout(() => {
        if (!selectedTeam) {
          setSearchValue("");
        }
        setShowDropdown(false);
      }, 200);
    }
    
    if (!mounted) {
      return (
        <div className="relative">
          <Input
            label="Tên đội bóng"
            labelPlacement="outside"
            size="lg"
            placeholder="Đang tải..."
            variant="bordered"
            className="flex-1"
            isDisabled
          />
        </div>
      );
    }
    
    return (
      <div className="relative">
        <div className="flex items-center">
          <Input
            label="Tên đội bóng"
            labelPlacement="outside"
            size="lg"
            value={selectedTeam ? selectedTeam.name || "" : searchValue}
            variant="bordered"
            onChange={(e) => {
              setSearchValue(e.target.value);
              setSelectedTeam(null);
              setTeam("");
            }}
            placeholder="Chọn đội bóng..."
            className="flex-1"
            onFocus={toggleDropdown}
            onBlur={handleBlur}
            endContent={
              mounted ? 
                (!showDropdown ? 
                  <ChevronDown className="text-default-400 cursor-pointer" size={20} onClick={toggleDropdown} /> : 
                  <ChevronUp className="text-default-400 cursor-pointer" size={20} onClick={toggleDropdown} />
                ) : null
            }
          />
        </div>
        {mounted && showDropdown && (
          <div className="absolute z-[9999] w-full mt-1 bg-default-50 border rounded-md shadow-lg">
            <div className="max-h-[200px] overflow-y-auto">
              {teams.map((team: any) => (
                <div 
                  key={team.id} 
                  className="flex items-center gap-2 p-2 hover:bg-default-100 cursor-pointer"
                  onClick={() => handleSelectTeam(team)}
                >
                  {team.logoUrl && <img src={team.logoUrl} alt={team.name || ""} className="w-8 h-8 rounded-full" />}
                  <span>{team.name || ""}</span>
                </div>
              ))}
              {teams.length === 0 && (
                <div className="p-2 text-center text-default-500">Không tìm thấy đội bóng</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
}
