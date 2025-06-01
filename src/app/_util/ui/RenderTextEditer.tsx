import React, { useState } from 'react'

interface RenderTextEditerProps {
    value: string;
    type?: 'all' | 'sort';
    size?: string;
}

export default function RenderTextEditer({ value, type = 'all'}: RenderTextEditerProps) {
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
        <div className={`text-editor-container p-4ư`}>
            <h2 className="text-lg font-medium mb-4 text-gray-900">CHI TIẾT SẢN PHẨM</h2>
            {/* Content area */}
            <div className={type === 'sort' ? 'p-5' : 'p-4'}>
                <div
                    className={`text-content ${
                        type === 'sort' 
                            ? `${isExpanded ? 'max-h-none' : 'h-[30rem]'} overflow-hidden transition-all duration-300` 
                            : 'h-full overflow-hidden'
                    }`}
                    dangerouslySetInnerHTML={{ __html: sanitizedValue }}
                />

                {/* Fade overlay khi content bị cắt */}
                {type === 'sort' && !isExpanded && sanitizedValue.length > 100 && (
                    <div className="relative">
                        <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    </div>
                )}
            </div>

            {/* Button đơn giản */}
            {type === 'sort' && sanitizedValue.length > 100 && (
                <div className="px-5 pb-5">
                    <div className="flex justify-center pt-3 border-t border-gray-100">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 rounded-md transition-colors duration-200"
                        >
                            {isExpanded ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    Thu gọn
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Xem thêm
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}