import { Button, Input } from '@nextui-org/react'
import { Plus, Search } from 'lucide-react'
import React from 'react'

interface TitleSearchAddProps {
  title: any
  onSearch?: (value: string) => void
  onAdd?: () => void
}

export default function TitleSearchAdd({ title, onSearch, onAdd }: TitleSearchAddProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border mb-4 gap-4">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{title.title}</h1>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder={title.search}
            className="w-full sm:w-[280px]"
            size="sm"
            startContent={<Search size={18} className="text-default-400" />}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        {title.btn && (
        <Button
          color="primary"
          className="h-[40px] font-medium w-full sm:w-auto"
          startContent={<Plus size={18} />}
          onClick={onAdd}
          >
            {title.btn}
          </Button>
        )}
      </div>
    </div>
  )
}
