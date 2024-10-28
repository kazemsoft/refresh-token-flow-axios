export const TokenService = {
    getLocalAccessToken() {
        return localStorage.getItem('accessToken');
    },
    getLocalRefreshToken() {
        return localStorage.getItem('refreshToken');
    },
    updateLocalAccessToken(token) {
        localStorage.setItem('accessToken', token);
    },
    updateLocalRefreshToken(token) {
        localStorage.setItem('refreshToken', token);
    },
};
