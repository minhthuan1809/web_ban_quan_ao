'use client';

import React, { useEffect } from 'react';
import SunEditor from 'suneditor-react';
import { uploadToCloudinary } from '../upload_img_cloudinary';

interface InputTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    height?: number;
}

const InputTextEditor: React.FC<InputTextEditorProps> = ({
    value,
    onChange,
    height = 500,
}) => {
    // Đảm bảo giá trị ban đầu được set
    useEffect(() => {
        if (value === undefined) {
            onChange('');
        }
    }, []);

    const handleChange = (content: string) => {
        // Đảm bảo luôn trả về string, không phải undefined
        onChange(content || '');
    };

    return (
        <SunEditor
            setContents={value || ''}
            onChange={handleChange}
            height={`${height}px`}
            setOptions={{
                buttonList: [
                    ['undo', 'redo'],
                    ['font', 'fontSize', 'formatBlock'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                    ['removeFormat'],
                    ['fontColor', 'hiliteColor'],
                    ['indent', 'outdent'],
                    ['align', 'horizontalRule', 'list', 'table'],
                    ['link', 'image', 'video'],
                    ['fullScreen', 'showBlocks', 'codeView'],
                    ['preview', 'print'],
                    ['save', 'template'],
                ],
                defaultTag: 'div',
                minHeight: '300px',
                showPathLabel: false,
                font: [
                    'Arial',
                    'Comic Sans MS',
                    'Courier New',
                    'Impact',
                    'Georgia',
                    'Tahoma',
                    'Trebuchet MS',
                    'Verdana'
                ],
                formats: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                fontSize: [8, 10, 12, 14, 16, 18, 20, 24, 28, 36, 48, 72],
                colorList: [
                    '#ff0000', '#ff8c00', '#ffff00', '#008000', '#0000ff', '#4b0082', '#800080',
                    '#000000', '#808080', '#ffffff'
                ],
                imageUploadSizeLimit: 5242880,
                imageAccept: '.jpg, .jpeg, .png, .gif',
                videoAccept: '.mp4, .webm',
                videoUploadSizeLimit: 52428800,
                imageResizing: true,
                imageHeightShow: true,
                imageAlignShow: true,
                imageWidth: '100%',
                imageHeight: 'auto',
                charCounter: true,
                linkTargetNewWindow: true,
                mediaAutoSelect: false,
                addTagsWhitelist: 'figure[style] img[style]',
                attributesWhitelist: {
                    all: 'style|align|class',
                    figure: 'style',
                    img: 'style|src|alt'
                },
                pasteTagsWhitelist: 'figure|img|p|div|h1|h2|h3|h4|h5|h6|b|strong|i|em|u|s|span|a|br',
                resizingBar: true
            }}

            // thêm hình ảnh lên server
            onImageUploadBefore={(files, info, uploadHandler) => {
                try {
                    if (files.length === 0) return false;
                    // Upload to Cloudinary
                    uploadToCloudinary([files[0]], 'textEditer').then((res) => {
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
