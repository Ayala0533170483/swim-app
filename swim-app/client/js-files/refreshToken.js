import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const refreshToken = async () => {
    const res = await fetch('http://localhost:3000/refresh', {
        method: 'POST',
        credentials: 'include',
    });

    if (!res.ok) {
        // הרפרש טוקן פג תוקף - נקה הכל
        Cookies.remove("accessToken");
        localStorage.removeItem("currentUser");
        
        // הפנה להתחברות
        window.location.href = '/login';
        
        throw new Error("Session expired - please login again");
    }

    const data = await res.json();
    Cookies.set("accessToken", data.accessToken);
    return data.accessToken;
};
export default refreshToken;
export { refreshToken };