import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import "../styles/Update.css";
import useHandleError from "./useHandleError";
import refreshToken from "../js-files/refreshToken";
import Cookies from 'js-cookie';
function Update({ userType,item, type, updateDisplay,nameButton, setDisplayChanged = () => {} }) {
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
        return await fetch(`http://localhost:3000//${userType}/${type}/${item.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                // ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: 'include',
            body: JSON.stringify({ ...item, ...updatedItem }),
        });
    };

    async function updateItem() {
        let token = Cookies.get("accessToken");

        try {
            let response = await sendUpdateRequest(token);

            if (response.status === 401|| response.status === 403) {
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
                        <h2>{nameButton}</h2>
                        {Object.keys(updatedItem).map(
                            (key) =>
                                key !== "id" && (
                                    <div key={key} style={{ marginBottom: "10px" }}>
                                        <label htmlFor={key} style={{ display: "block", fontWeight: "bold" }}>
                                            {key}:
                                        </label>
                                        <input
                                            id={key}
                                            value={updatedItem[key]}
                                            placeholder={key}
                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    </div>
                                )
                        )}
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                            <button onClick={updateItem} className="btn-primary">Update</button>
                            <button onClick={handleCancel} className="btn-primary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Update;