const API_URL = process.env.REACT_APP_API_URL || 'https://civic-connect-hams.onrender.com';

/**
 * Returns the correct image src whether imageUrl is a full Cloudinary/http URL
 * or a legacy local filename stored under /uploads/.
 */
export function getImageSrc(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API_URL}/uploads/${url}`;
}

export default getImageSrc;
