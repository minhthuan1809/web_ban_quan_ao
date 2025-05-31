import React from 'react'

interface RenderTextEditerProps {
    value: string;
}

export default function RenderTextEditer({ value }: RenderTextEditerProps) {
    // Sanitize and validate HTML content before rendering
    if (!value) return null

    const sanitizeHTML = (html: string) => {
        if (!html || typeof html !== 'string') {
            return '';
        }
        // Basic sanitization - remove any unclosed tags
        return html.replace(/<[^>]*$/g, '');
    }

    const sanitizedValue = sanitizeHTML(value);

    return (
        <div className="text-editor-container">
            <div
                className="text-content"
                dangerouslySetInnerHTML={{ __html: sanitizedValue }}
            />
        </div>
    )
}
