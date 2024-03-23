// if var is not set, use empty string (request will land on API behind Nginx reverse proxy)
export const serverUrl = import.meta.env.VITE_SERVER_URL ?? '';
