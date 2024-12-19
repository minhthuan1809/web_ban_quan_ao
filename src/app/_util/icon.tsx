import * as Icon from "lucide-react";

interface GetIconComponentProps {
  icon?: keyof typeof Icon;
  className?: string;
  size?: number;
}

export default function GetIconComponent({
  icon,
  className,
  size,
}: GetIconComponentProps) {
  if (!icon || !(icon in Icon)) {
    return null; // Trả về null nếu không tìm thấy icon
  }

  const IconComponent = Icon[icon] as React.ElementType;
  return <IconComponent className={className} size={size} />;
}
