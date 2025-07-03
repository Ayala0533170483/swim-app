import React from "react";
import { FaTrash } from "react-icons/fa";
import useHandleError from "../hooks/useHandleError";
import refreshToken from "../js-files/RefreshToken";
import Cookies from 'js-cookie';

function Delete({
    id,
    type,
    deleteDisplay,
    setDisplayChanged = () => { },
    nameButton = "",
    text = "",
    additionalData = null
}) {
    const { handleError } = useHandleError();

    const sendDeleteRequest = async (token, url, body = null) => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: 'include',
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        return await fetch(url, options);
    };

    async function deleteItem() {
        let token = Cookies.get("accessToken");

        try {
            let response = await sendDeleteRequest(token, `http://localhost:3000/${type}/${id}`, additionalData);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendDeleteRequest(token, `http://localhost:3000/${type}/${id}`, additionalData);
            }

            if (response.ok) {
                deleteDisplay(id);
                setDisplayChanged(true);
            } else {
                handleError("deleteError", null, true);
            }
        } catch (error) {
            handleError("deleteError", error, false);
        }
    }

    const displayText = nameButton || text || "";

    return (
        <button className="edit-button delete-variant" onClick={deleteItem}>
            <FaTrash className="edit-icon" />
            {displayText}
        </button>
    );
}

export default Delete;
