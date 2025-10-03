import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://dev.surrosantara.space/api/v1';

// Create a separate API instance for auth operations that doesn't depend on the store
const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to make authenticated auth requests
export const makeAuthenticatedAuthRequest = async (token: string, endpoint: string, data: any) => {
    return authApi.post(endpoint, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
};

export default authApi;
