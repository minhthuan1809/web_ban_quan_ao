import { addTeam_API, updateTeam_API } from '@/app/_service/category';
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter } from '@nextui-org/react'
import { Flag, Globe, Trophy, User, X } from 'lucide-react'
import React from 'react'
import useAuthInfor from '@/app/customHooks/AuthInfor';
import { toast } from 'react-toastify';
import ImgUpload from '@/app/components/ui/ImgUpload';
import { uploadToCloudinary } from '@/app/_util/upload_img_cloudinary';

interface ModalAddEditTeamProps {
  id: string;
  form: {
    name: string;
    league: string; 
    country: string;
    logoUrl: string;
    setName: (value: string) => void;
    setLeague: (value: string) => void;
    setCountry: (value: string) => void;
    setLogoUrl: (value: string) => void;
  };
  onClose: () => void;
  open: boolean;
}

export default function ModalAddEditTeam({ id, form, onClose, open }: ModalAddEditTeamProps) {
  const { accessToken } = useAuthInfor();
  const [logoFile, setLogoFile] = React.useState<File | null>(null);

  const handleAddTeam = async (logoUrl: string) => {
    try {
      const response = await addTeam_API({...form, logoUrl}, accessToken);
      if (response.status === 200) {
        toast.success("Thêm đội bóng thành công!");
        onClose();
      } else {
        toast.error("Thêm đội bóng thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm đội bóng!");
    }
  }

  const addImg = async (file: File | string) => {
    if (typeof file === 'string' && file.includes("https://res.cloudinary.com/")) {
      return [file];
    }
    if (file instanceof File) {
      const res = await uploadToCloudinary([file], "teamBall");
      return res;
    }
    return [];
  }

  const handleEditTeam = async () => {
    try {
      const res = await addImg(logoFile || form.logoUrl);
      const response = await updateTeam_API(id, {...form, logoUrl: res[0]}, accessToken);
      if (response.status === 200) {
        toast.success("Cập nhật đội bóng thành công!");
        onClose();
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật đội bóng!");
    }
  }
  const handleFinish = async () => {  
    if (!form.name || !form.league || !form.country || !(logoFile || form.logoUrl)) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const res = await addImg(logoFile || form.logoUrl);
      await handleAddTeam(res[0]);
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <Modal 
      isOpen={open} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Thêm đội bóng</h1>
          <Button 
            isIconOnly 
            color="danger" 
            variant="light" 
            onPress={onClose}
            className="rounded-full"
          >
          </Button>
        </ModalHeader>

        <ModalBody className="gap-4"> 

        <ImgUpload setPreview={form.setLogoUrl} preview={logoFile || form.logoUrl} setFile={setLogoFile} />
          <Input
            label="Tên đội bóng"
            placeholder="Nhập tên đội bóng..." 
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
            startContent={<User className="text-default-400" size={20} />}
            variant="bordered"
          />
          <Input
            label="Giải đấu"
            placeholder="Nhập tên giải đấu..."
            value={form.league}
            onChange={(e) => form.setLeague(e.target.value)}
            startContent={<Trophy className="text-default-400" size={20} />}
            variant="bordered"
          />
          <Input
            label="Quốc gia"
            placeholder="Nhập tên quốc gia..."
            value={form.country}
            onChange={(e) => form.setCountry(e.target.value)}
            startContent={<Flag className="text-default-400" size={20} />}
            variant="bordered"
          />
       
        </ModalBody>

        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
          >
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={id ? handleEditTeam :  handleFinish}  
          >
            {id ? "Cập nhật" : "Thêm"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}