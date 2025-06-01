import { Share2 } from "lucide-react";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    TelegramShareButton,
    TelegramIcon,
  } from "react-share";
import { toast } from "react-toastify";
  
  export default function ShareSocial ({className , size = 20}: {className: string, size: number}) {
    const shareUrl = window.location.href;
    const title = "Chia sẻ bài viết này!";
  
    return (
      <div className={`flex gap-2 ${className} justify-end cursor-pointer items-center`}>
        <div className="flex gap-2 bg-gray-100 p-2 rounded-full" onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Đã copy link sản phẩm')
          }}>
        <Share2 size={size - 5} />    
        </div>
        <FacebookShareButton url={shareUrl} title={title}>
          <FacebookIcon size={size} round />
        </FacebookShareButton>
  
        <TwitterShareButton url={shareUrl} title={title}>
          <TwitterIcon size={size} round />
        </TwitterShareButton>
  
        <TelegramShareButton url={shareUrl} title={title}>
          <TelegramIcon size={size} round />
        </TelegramShareButton>
      </div>
    );
  };
  