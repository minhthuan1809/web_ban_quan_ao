import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

let foder = 'kick-style';

const handleFolder = (type: string) => {
  switch (type) {
    case 'product':
      return 'kick-style';
    case 'category':
      return 'kick-style-avatar';
    default:
      return 'kick-style';
  }
}

// Validate environment variables
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_APIKEY ||
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_RECRET) {
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_APIKEY || '',
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_RECRET || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json() as { image: string, type: string };
    const { image, type } = body; // đây là đường dẫn của ảnh

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: handleFolder(type),
      resource_type: 'auto',
    });

    return NextResponse.json({
      success: true,
      data: uploadResponse
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json() as { id: string, folder: string };
    const { id, folder } = body;

    if (!id || !folder) {
      return NextResponse.json(
        { error: 'Missing required parameters (id or folder)' },
        { status: 400 }
      );
    }

    // Construct the full public ID including the folder path
    const fullPublicId = `${folder}/${id}`;

    const deleteResponse = await cloudinary.uploader.destroy(fullPublicId);

    if (deleteResponse.result === 'ok') {
      return NextResponse.json({
        success: true,
        data: deleteResponse
      });
    } else {
      return NextResponse.json(
        {
          error: 'Failed to delete image',
          details: deleteResponse.result
        },
        { status: 400 }
      );
    }

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to delete image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
