import React, { useContext } from "react"
import { FaTrash } from "react-icons/fa";
import useHandleError from "../hooks/useHandleError";
import refreshToken from "../js-files/RefreshToken";
import Cookies from 'js-cookie';

function Delete({ 
    id, 
    type, 
    deleteDisplay, 
    setDisplayChanged = () => { }, 
    dependent, 
    nameButton = "", // 🎯 הפרמטר הזה כבר קיים
    text = "" // 🎯 נוסיף גם text כאופציה נוספת
}) {
    const { handleError } = useHandleError();

    const sendDeleteRequest = async (token, url) => {
        return await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: 'include',
        });
    };

    async function deleteItem() {
        let token = Cookies.get("accessToken");

        try {
            if (dependent) {
                let singularType = type.slice(0, -1);
                let dependentArrayResponse = await sendDeleteRequest(token, `http://localhost:3000/${dependent}/?${singularType}Id=${id}`);

                if (dependentArrayResponse.status === 401 || dependentArrayResponse.status === 403) {
                    token = await refreshToken();
                    dependentArrayResponse = await sendDeleteRequest(token, `http://localhost:3000/${dependent}/?${singularType}Id=${id}`);
                }

                if (!dependentArrayResponse.ok) {
                    throw new Error(`Failed to fetch dependent data for ${dependent}`);
                }

                let dependentArray = await dependentArrayResponse.json();
                for (let element of dependentArray) {
                    let dependentResponse = await sendDeleteRequest(token, `http://localhost:3000/${dependent}/${element.id}`);

                    if (dependentResponse.status === 401 || dependentResponse.status === 403) {
                        token = await refreshToken();
                        dependentResponse = await sendDeleteRequest(token, `http://localhost:3000/${dependent}/${element.id}`);
                    }

                    if (!dependentResponse.ok) {
                        throw new Error(`Failed to delete dependent ${dependent} with ID: ${element.id}`);
                    }
                }
            }

            let response = await sendDeleteRequest(token, `http://localhost:3000/${type}/${id}`);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendDeleteRequest(token, `http://localhost:3000/${type}/${id}`);
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

    // 🎯 קביעת הטקסט שיוצג
    const displayText = nameButton || text || "";

    return (
        <button className="edit-button delete-variant" onClick={deleteItem}>
            <FaTrash className="edit-icon" />
            {displayText} {/* 🎯 הצגת הטקסט */}
        </button>
    )
}

export default Delete;
