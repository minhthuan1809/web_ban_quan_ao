export const uploadToCloudinary = async (files: (File | string)[], type: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(async (file) => {
      
      if (typeof file === 'string' && file.includes('cloudinary.com')) {
        return file;
      }

      // At this point, file must be a File object
      const fileObj = file as File;

      // Validate file type - accept all image types
      if (!fileObj.type.startsWith('image/')) {
        throw new Error(`Invalid file type: ${fileObj.type}. Only image files are supported.`);
      }

      // Convert File to base64
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result !== 'string') {
            reject(new Error('Failed to convert file to base64'));
            return;
          }
          resolve(reader.result);
        };

        reader.onerror = () => {
          reject(new Error(`Failed to read file: ${fileObj.name}`));
        };

        reader.readAsDataURL(fileObj);
      });
      
      try {
        const response = await fetch('/api/cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64String,
            type: type
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.details || data.error || `Upload failed with status ${response.status}`);
        }

        if (!data.success || !data.data?.secure_url) {
          throw new Error('Invalid response format from server');
        }

        return data.data.secure_url;

      } catch (error) {
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results;

  } catch (error) {
    throw error;
  }
}; 