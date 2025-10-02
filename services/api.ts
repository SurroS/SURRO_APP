import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://dev.surrosantara.space/api/v1';
// const API_BASE_URL = "https://dev.surrosantara.space/api/v1";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;