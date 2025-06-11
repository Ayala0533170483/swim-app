import { Navigate } from 'react-router-dom';
import './RefreshToken';
import Cookies from 'js-cookie';
import { refreshToken } from './RefreshToken';

export const fetchData = async (typeOfItem, id = "", handleError) => {
  const url = `http://localhost:3000/${typeOfItem}/?${id}`;

  const makeRequest = async (token) => {
    return await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    });
  };

  try {
    let token = Cookies.get("accessToken");
    let response = await makeRequest(token);

    if (response.status === 401 || response.status === 403) {
      token = await refreshToken();
      response = await makeRequest(token);
    }

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (id && (!result || (Array.isArray(result) && result.length === 0))) {
      throw new Error(`No ${typeOfItem} found with ID: ${id}`);
    }

    return result;

  } catch (error) {
    handleError("getError", error);
  }
};

