import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import "../styles/Update.css";
import useHandleError from "./useHandleError";
import refreshToken from "../js-files/RefreshToken";
import Cookies from 'js-cookie';

function Update({ userType, item, type, updateDisplay, nameButton, setDisplayChanged = () => { } }) {
    const [showUpdateDetails, setShowUpdateDetails] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item);
    const { handleError } = useHandleError();

    const handleInputChange = (key, value) => {
        setUpdatedItem((prevItem) => ({
            ...prevItem,
            [key]: value,
        }));
    };

    const sendUpdateRequest = async (token) => {
        return await fetch(`http://localhost:3000/${type}/${item.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ ...item, ...updatedItem }),
        });
    };

    async function updateItem() {
        let token = Cookies.get("accessToken");

        try {
            let response = await sendUpdateRequest(token);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendUpdateRequest(token);
            }

            if (response.ok) {
                const updatedData = { ...item, ...updatedItem };
                updateDisplay(updatedData);
                setShowUpdateDetails(false);
                setDisplayChanged(true);
            } else {
                throw new Error("Failed to update item.");
            }
        } catch (ex) {
            handleError("updateError", ex);
        }
    }

    const handleCancel = () => {
        setUpdatedItem(item);
        setShowUpdateDetails(false);
    };

    return (
        <>
            <button className="edit-button" onClick={() => setShowUpdateDetails(true)}>
                <FaPen className="edit-icon" />
                {nameButton}
            </button>

            {showUpdateDetails && (
                <div className="overlay">
                    <div className="modal">
                        <h2 className="modal-title">{nameButton}</h2>
                        <div className="form-container">
                            {Object.keys(updatedItem).map(
                                (key) =>
                                    key !== "id" && (
                                        <div key={key} className="form-field">
                                            <label htmlFor={key} className="field-label">
                                                {key}:
                                            </label>
                                            <input
                                                id={key}
                                                value={updatedItem[key]}
                                                placeholder={key}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                className="field-input"
                                            />
                                        </div>
                                    )
                            )}
                        </div>
                        <div className="button-container">
                            <button onClick={updateItem} className="btn-primary">
                                עריכה
                            </button>
                            <button onClick={handleCancel} className="btn-primary">
                                ביטול
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Update;
