"use client";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapPin, Map, Home, Loader2, CheckCircle } from "lucide-react";
import { Select, SelectItem, Skeleton } from "@nextui-org/react";
import { getCityVietnam } from '@/app/_service/addressVietnam';

interface AddressData {
  city: { cityId: number; cityName: string };
  district: { districtId: number; districtName: string };
  ward: { wardId: number; wardName: string };
}

interface City {
  code: number;
  name: string;
  districts: District[];
}

interface District {
  code: number;
  name: string;
  wards: Ward[];
}

interface Ward {
  code: number;
  name: string;
}

interface InputAddressProps {
  onChange: (value: AddressData) => void;
  className?: string;
  defaultValue?: AddressData;
  disabled?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const normalizeName = (name: string) => {
  if (!name) return "";
  return name
    .replace(/^(Tỉnh|Thành phố|Quận|Huyện|Phường|Xã)\s*/i, "") // Remove common prefixes
    .trim();
};

const findBestMatch = (searchName: string, items: any[], nameKey: string = 'name') => {
  if (!searchName) return null;
  
  const normalizedSearch = normalizeName(searchName);
  
  // First try exact match
  let match = items.find(item => normalizeName(item[nameKey]) === normalizedSearch);
  if (match) {
    return match;
  }
  
  // Then try contains
  match = items.find(item => 
    normalizeName(item[nameKey]).includes(normalizedSearch) ||
    normalizedSearch.includes(normalizeName(item[nameKey]))
  );
  if (match) {
    return match;
  }
  
  // Finally try case-insensitive contains
  match = items.find(item => 
    normalizeName(item[nameKey]).toLowerCase().includes(normalizedSearch.toLowerCase()) ||
    normalizedSearch.toLowerCase().includes(normalizeName(item[nameKey]).toLowerCase())
  );
  if (match) {
    return match;
  }
  
  return null;
};

export default function InputAddress({
  onChange,
  className = "",
  defaultValue,
  disabled = false,
  onValidationChange,
}: InputAddressProps) {
  const [dataCityVietnam, setDataCityVietnam] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Load data on mount
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        const data = await getCityVietnam();
        setDataCityVietnam(data);
        
        // Set default values if provided
        if (defaultValue?.city.cityName) {
          const city = findBestMatch(defaultValue.city.cityName, data);
          if (city) {
            setSelectedCity(city);
            
            if (defaultValue.district.districtName) {
              const district = findBestMatch(defaultValue.district.districtName, city.districts);
              if (district) {
                setSelectedDistrict(district);
                
                if (defaultValue.ward.wardName) {
                  const ward = findBestMatch(defaultValue.ward.wardName, district.wards);
                  if (ward) {
                    setSelectedWard(ward);
                  }
                }
              }
            }
          }
        } else if (defaultValue?.city.cityId) {
          // Fallback: tìm theo ID nếu có
          const city = data.find((c: City) => c.code === defaultValue.city.cityId);
          if (city) {
            setSelectedCity(city);
            
            if (defaultValue.district.districtId) {
              const district = city.districts.find((d: District) => d.code === defaultValue.district.districtId);
              if (district) {
                setSelectedDistrict(district);
                
                if (defaultValue.ward.wardId) {
                  const ward = district.wards.find((w: Ward) => w.code === defaultValue.ward.wardId);
                  if (ward) {
                    setSelectedWard(ward);
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        setError("Không thể tải dữ liệu địa chỉ");
        console.error("Error loading address data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCityData();
  }, [defaultValue]);

  // Validation
  const isValid = useMemo(() => {
    return !!(selectedCity && selectedDistrict && selectedWard);
  }, [selectedCity, selectedDistrict, selectedWard]);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  // Helper function to create address data
  const createAddressData = useCallback((
    city: City | null,
    district: District | null,
    ward: Ward | null
  ): AddressData => ({
    city: {
      cityId: city?.code || 0,
      cityName: city?.name || '',
    },
    district: {
      districtId: district?.code || 0,
      districtName: district?.name || '',
    },
    ward: {
      wardId: ward?.code || 0,
      wardName: ward?.name || '',
    }
  }), []);

  // City change handler
  const handleCityChange = useCallback((cityCode: string) => {
    const code = parseInt(cityCode);
    const city = dataCityVietnam.find(c => c.code === code) || null;
    
    setSelectedCity(city);
    setSelectedDistrict(null);
    setSelectedWard(null);
    
    onChange(createAddressData(city, null, null));
  }, [dataCityVietnam, onChange, createAddressData]);

  // District change handler
  const handleDistrictChange = useCallback((districtCode: string) => {
    const code = parseInt(districtCode);
    const district = selectedCity?.districts.find(d => d.code === code) || null;
    
    setSelectedDistrict(district);
    setSelectedWard(null);
    
    onChange(createAddressData(selectedCity, district, null));
  }, [selectedCity, onChange, createAddressData]);

  // Ward change handler
  const handleWardChange = useCallback((wardCode: string) => {
    const code = parseInt(wardCode);
    const ward = selectedDistrict?.wards.find(w => w.code === code) || null;
    
    setSelectedWard(ward);
    
    onChange(createAddressData(selectedCity, selectedDistrict, ward));
  }, [selectedCity, selectedDistrict, onChange, createAddressData]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* City Selection */}
      <div>
        <Select
          label="Tỉnh/Thành phố"
          placeholder="Chọn Tỉnh/Thành phố"
          variant="bordered"
          isRequired
          isDisabled={disabled}
          selectedKeys={selectedCity ? [selectedCity.code.toString()] : []}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string;
            if (key) handleCityChange(key);
          }}
          startContent={<MapPin className="w-4 h-4 text-default-400" />}
          endContent={selectedCity ? <CheckCircle className="w-4 h-4 text-green-500" /> : null}
          classNames={{
            trigger: "min-h-12",
            label: "text-sm font-medium",
          }}
        >
          {dataCityVietnam.map((city) => (
            <SelectItem key={city.code.toString()} value={city.code.toString()}>
              {city.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* District Selection */}
      <div>
        <Select
          label="Quận/Huyện"
          placeholder="Chọn Quận/Huyện"
          variant="bordered"
          isRequired
          isDisabled={disabled || !selectedCity}
          selectedKeys={selectedDistrict ? [selectedDistrict.code.toString()] : []}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string;
            if (key) handleDistrictChange(key);
          }}
          startContent={<Map className="w-4 h-4 text-default-400" />}
          endContent={selectedDistrict ? <CheckCircle className="w-4 h-4 text-green-500" /> : null}
          classNames={{
            trigger: "min-h-12",
            label: "text-sm font-medium",
          }}
        >
          {(selectedCity?.districts || []).map((district) => (
            <SelectItem key={district.code.toString()} value={district.code.toString()}>
              {district.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Ward Selection */}
      <div>
        <Select
          label="Phường/Xã"
          placeholder="Chọn Phường/Xã"
          variant="bordered"
          isRequired
          isDisabled={disabled || !selectedDistrict}
          selectedKeys={selectedWard ? [selectedWard.code.toString()] : []}
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0] as string;
            if (key) handleWardChange(key);
          }}
          startContent={<Home className="w-4 h-4 text-default-400" />}
          endContent={selectedWard ? <CheckCircle className="w-4 h-4 text-green-500" /> : null}
          classNames={{
            trigger: "min-h-12",
            label: "text-sm font-medium",
          }}
        >
          {(selectedDistrict?.wards || []).map((ward) => (
            <SelectItem key={ward.code.toString()} value={ward.code.toString()}>
              {ward.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Address Summary */}
      {isValid && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Địa chỉ đã chọn:</p>
              <p className="mt-1">
                {selectedWard?.name}, {selectedDistrict?.name}, {selectedCity?.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
