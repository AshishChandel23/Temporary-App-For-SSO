export const Base = {
    BaseUrl : 'http://localhost:4001/api/v1',
}

import { jwtDecode } from "jwt-decode";
export function getDecodedAccessToken() {
    const token = localStorage.getItem('token');
    console.log("token ::>>", token);
    try {
        return token ? jwtDecode(token) : null;
    } catch (Error) {
        return null;
    }
}