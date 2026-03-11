export const isAuthenticated = () => !!localStorage.getItem("access_token");

export const getAccessToken = () => localStorage.getItem("access_token");

export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};
