export const shortenUrl = async (url) => {
  const API_KEY = import.meta.env.VITE_SHORTEN_URL_API;
  const apiUrl = `https://api.tinyurl.com/create?url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`, // Use loaded API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      throw new Error(`Failed to shorten the URL: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // console.log('Shortened URL Response:',  data.data.tiny_url); 
    return data.data.tiny_url;
  } catch (error) {
    // console.error('Error shortening URL:', error);
    return null;
  }
};
