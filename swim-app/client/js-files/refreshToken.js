import Cookies from 'js-cookie';
const refreshToken = async () => {
    const res = await fetch('http://localhost:3000/refresh', {
        method: 'POST',
        credentials: 'include',
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    Cookies.set("accessToken", data.accessToken);
    return data.accessToken;
};
export default refreshToken;
export { refreshToken };