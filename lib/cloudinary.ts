import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dxiccp9b8',
  api_key: '861389368398686',
  api_secret: 'rqRlmI2iXKOZUjF3tHYM5Svor3o',
});

export default cloudinary;

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // First, try with unsigned upload preset
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/dxiccp9b8/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      
      // If unsigned upload fails, try signed upload with timestamp
      return await uploadImageSigned(file);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadImageSigned = async (file: File): Promise<string> => {
  try {
    // Generate timestamp for signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Create signature (you'll need to implement this server-side for security)
    const response = await fetch('/api/upload/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timestamp }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get upload signature');
    }
    
    const { signature } = await response.json();
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('api_key', '861389368398686');
    
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/dxiccp9b8/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Signed upload failed:', uploadResponse.status, errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await uploadResponse.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error in signed upload:', error);
    throw error;
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
