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
    nameButton = "",
    text = "",
    additionalData = null  // פרמטר חדש אופציונלי
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
        
        // אם יש נתונים נוספים, נוסיף אותם לגוף הבקשה
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        return await fetch(url, options);
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
    )
}

export default Delete;
