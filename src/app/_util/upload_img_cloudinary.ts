export const uploadToCloudinary = async (files: File[], type: string): Promise<string[]> => {
  try {


    const uploadPromises = files.map(async (file) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}. Supported types: JPEG, PNG, GIF, WEBP`);
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
          reject(new Error(`Failed to read file: ${file.name}`));
        };

        reader.readAsDataURL(file);
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
          console.error('Server response:', data);
          throw new Error(data.details || data.error || `Upload failed with status ${response.status}`);
        }

        if (!data.success || !data.data?.secure_url) {
          console.error('Invalid server response:', data);
          throw new Error('Invalid response format from server');
        }

        console.log(`Successfully uploaded: ${file.name}`);
        return data.data.secure_url;

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);
    console.log('All uploads completed successfully');
    return results;

  } catch (error) {
    console.error('Upload process failed:', error);
    throw error;
  }
}; 