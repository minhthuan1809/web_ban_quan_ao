'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
import { uploadToCloudinary } from '../upload_img_cloudinary';

const SunEditor = dynamic(() => import('suneditor-react'), {
    ssr: false,
});

interface InputTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: number;
}

const InputTextEditor: React.FC<InputTextEditorProps> = ({ value, onChange, height = 200 }) => {
    const handleChange = (content: string) => {
        onChange(content);
    };

    return (
        <SunEditor
            setContents={value}
            onChange={handleChange}
            height={`${height}px`}
            setOptions={{
                buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['removeFormat'],
                    ['fontColor', 'hiliteColor'],
                    ['align', 'list', 'lineHeight'],
                    ['outdent', 'indent'],
                    ['table', 'link', 'image'],
                    ['fullScreen', 'showBlocks', 'codeView'],
                ],
                defaultTag: 'div',
                minHeight: '150px',
                showPathLabel: false,
                charCounter: false,
                resizingBar: false,
            }}

            // thêm hình ảnh lên server
            onImageUploadBefore={(files, info, uploadHandler) => {
                try {
                    if (files.length === 0) return false;
                    // Upload to Cloudinary
                    uploadToCloudinary([files[0]], process.env.NEXT_PUBLIC_FOLDER || "").then((res) => {
                        if (res && res.length > 0) {
                            const result = {
                                result: [{
                                    url: res[0],
                                    name: files[0].name,
                                    size: files[0].size
                                }]
                            };
                            uploadHandler(result);
                        } else {
                            throw new Error('Failed to upload image');
                        }
                    });

                } catch (error) {
                    console.error('Error uploading image:', error);
                    return false;
                }
            }}
        />
    );
};

export default InputTextEditor;
