// if var is not set, use empty string (request will land on API behind Nginx reverse proxy)
const mode = import.meta.env.MODE;
const isProduction = mode === 'production';
export const serverUrlFallback = isProduction ? '' : 'http://localhost:5000';
export const serverUrl = import.meta.env.VITE_SERVER_URL ?? serverUrlFallback;

console.log('Mode:', mode);
console.log('Is production:', isProduction);
console.log('Server URL fallback:', serverUrlFallback);
console.log('Server URL:', serverUrl);

