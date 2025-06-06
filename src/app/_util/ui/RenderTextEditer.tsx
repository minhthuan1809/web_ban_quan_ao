import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface RenderTextEditerProps {
    value: string;
    type?: 'all' | 'sort';
    className?: string;
}

export default function RenderTextEditer({ 
    value, 
    type = 'all',
    className,
}: RenderTextEditerProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Sanitize and validate HTML content before rendering
    if (!value) return null;

    const sanitizeHTML = (html: string) => {
        if (!html || typeof html !== 'string') {
            return '';
        }
        // Basic sanitization - remove any unclosed tags
        return html.replace(/<[^>]*$/g, '');
    }

    const sanitizedValue = sanitizeHTML(value);

    return (
        <div className={cn(
            'w-full rounded-lg border border-border bg-card text-card-foreground shadow-sm',
            className
        )}>
         
            
            {/* Content area */}
            <div className={type === 'sort' ? 'p-5' : 'p-4'}>
                <div
                    className={cn(
                        'prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary',
                        type === 'sort' && !isExpanded && 'max-h-[30rem] overflow-hidden',
                        'transition-all duration-300'
                    )}
                    dangerouslySetInnerHTML={{ __html: sanitizedValue }}
                />

                {/* Fade overlay khi content bị cắt */}
                {type === 'sort' && !isExpanded && sanitizedValue.length > 100 && (
                    <div className="relative">
                        <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
                    </div>
                )}
            </div>

            {/* Expand/Collapse button */}
            {type === 'sort' && sanitizedValue.length > 100 && (
                <div className="px-5 pb-5">
                    <div className="flex justify-center pt-3 border-t border-border">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors duration-200"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-4 h-4" />
                                    Thu gọn
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4" />
                                    Xem thêm
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}