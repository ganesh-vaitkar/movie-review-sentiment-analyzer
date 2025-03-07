const getApiUrl = (endpoint) => {
  // Check if we're in production (GitHub Pages)
  if (import.meta.env.PROD) {
    // Using cors-anywhere proxy
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com'
    return `${CORS_PROXY}/http://172.105.58.210${endpoint}`
  }
  // In development, use the Vite proxy
  return `/api${endpoint}`
}

// Add this new function for making API calls
const makeApiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://ganesh-vaitkar.github.io',
        ...options.headers,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}

export { getApiUrl, makeApiCall } 