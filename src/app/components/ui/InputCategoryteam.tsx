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
    const [teams, setTeams] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<any>(null);

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
        } catch (err: any) {
          toast.error(err.message);
        } finally {
          setLoading(false);
        }
      }, [accessToken, currentPage, limit, searchValue]);

    useEffect(() => {
      fetchTeams();
    }, [fetchTeams]);

    useEffect(() => {
      // Set selected team when team prop changes
      if (team) {
        const foundTeam = teams.find((t: any) => t.id.toString() === team);
        if (foundTeam) {
          setSelectedTeam(foundTeam);
        }
      }
    }, [team, teams]);

    const handleSelectTeam = (team: any) => {
      setSelectedTeam(team);
      setTeam(team.id.toString());
      setShowDropdown(false);
    }

    const toggleDropdown = () => {
      setShowDropdown(!showDropdown);
    }
    
    return (
      <div className="relative">
        <div className="flex items-center">
          <Input
            label="Tên đội bóng"
            labelPlacement="outside"
            size="lg"
            value={selectedTeam ? selectedTeam.name : searchValue}
            variant="bordered"
            onChange={(e) => {
              setSearchValue(e.target.value);
              setSelectedTeam(null);
              setTeam("");
            }}
            placeholder="Chọn đội bóng..."
            className="flex-1"
            onFocus={toggleDropdown}
            endContent={!showDropdown ? <ChevronDown className="text-default-400" size={20} onClick={toggleDropdown} /> : <ChevronUp className="text-default-400" size={20} onClick={toggleDropdown} />}
          />
          
        </div>
        {showDropdown && (
          <div className="absolute z-[9999] w-full mt-1 bg-white border rounded-md shadow-lg">
            <div className="max-h-[200px] overflow-y-auto">
              {teams.map((team: any) => (
                <div 
                  key={team.id} 
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectTeam(team)}
                >
                  <img src={team.logoUrl} alt={team.name} className="w-8 h-8 rounded-full" />
                  <span>{team.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
}
