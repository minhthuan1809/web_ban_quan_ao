import { getCityVietnam } from "@/app/_service/addressVietnam";
import { Input } from "@nextui-org/react";
import React, { useEffect, useState } from 'react'
import { MapPin, Map, Home } from "lucide-react";

export default function InputAddress({
    onChange,
    className = "",
}: {
    onChange: (value: {city: {cityId: number, cityName: string}, district: {districtId: number, districtName: string}, ward: {wardId: number, wardName: string}}) => void;
    className?: string;
}) {
    const [dataCityVietnam, setDataCityVietnam] = useState<any[]>([]);
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
    const [selectedWard, setSelectedWard] = useState<any>(null);

    useEffect(() => {
        async function fetchCityData() {
            const data = await getCityVietnam();
            setDataCityVietnam(data);
        }
        fetchCityData();
    }, []);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const cityCode = parseInt(e.target.value);
        const city = dataCityVietnam.find(city => city.code === cityCode);
        setSelectedCity(city);
        setSelectedDistrict(null);
        setSelectedWard(null);
        onChange({
            city: {
                cityId: city?.code || 0,
                cityName: city?.name || '',
            },
            district: {
                districtId: 0,
                districtName: '',
            },
            ward: {
                wardId: 0,
                wardName: '',
            }
        });
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtCode = parseInt(e.target.value);
        const district = selectedCity?.districts.find((district: any) => district.code === districtCode);
        setSelectedDistrict(district);
        setSelectedWard(null);
        onChange({
            city: {
                cityId: selectedCity?.code || 0,
                cityName: selectedCity?.name || '',
            },
            district: {
                districtId: district?.code || 0,
                districtName: district?.name || '',
            },
            ward: {
                wardId: 0,
                wardName: '',
            }
        });
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardCode = parseInt(e.target.value);
        const ward = selectedDistrict?.wards.find((ward: any) => ward.code === wardCode);
        setSelectedWard(ward);
        
        onChange({
            city: {
                cityId: selectedCity?.code || 0,
                cityName: selectedCity?.name || '',
            },
            district: {
                districtId: selectedDistrict?.code || 0,
                districtName: selectedDistrict?.name || '',
            },
            ward: {
                wardId: ward?.code || 0,
                wardName: ward?.name || '',
            }
        });
    };

    return (
        <div className={className}>
            <div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Tỉnh/Thành phố</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                        <select
                            className="w-full p-2 pl-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleCityChange}
                            value={selectedCity?.code || ''}
                        >
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            {dataCityVietnam.map((city) => (
                                <option key={city.code} value={city.code}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Quận/Huyện</label>
                    <div className="relative">
                        <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                        <select
                            className="w-full p-2 pl-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleDistrictChange}
                            value={selectedDistrict?.code || ''}
                            disabled={!selectedCity}
                        >
                            <option value="">Chọn Quận/Huyện</option>
                            {selectedCity?.districts.map((district: any) => (
                                <option key={district.code} value={district.code}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Phường/Xã</label>
                    <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                        <select
                            className="w-full p-2 pl-9 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleWardChange}
                            value={selectedWard?.code || ''}
                            disabled={!selectedDistrict}
                        >
                            <option value="">Chọn Phường/Xã</option>
                            {selectedDistrict?.wards.map((ward: any) => (
                                <option key={ward.code} value={ward.code}>
                                    {ward.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
