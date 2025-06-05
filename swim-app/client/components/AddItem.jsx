import React, { useState } from "react";
import useHandleError from "./useHandleError";
import refreshToken from "../js-files/refreshToken";
import Cookies from 'js-cookie';

function AddItem({
    keys,
    type,
    addDisplay,
    role,
    defaltValues,
    setDisplayChanged = () => { },
    buttonText, // טקסט הכפתור
    buttonClassName = "add-item-button", // CSS class לכפתור
    containerClassName = "add-item-container", // CSS class לקונטיינר
    customStyles = {} // סטיילים מותאמים אישית
}) {
    const [showAddItem, setShowAddItem] = useState(false);
    const [item, setItem] = useState(defaltValues);
    const { handleError } = useHandleError();

    const handleInputChange = (key, value) => {
        setItem((prevItem) => ({ ...prevItem, [key]: value }));
    };

    const isFormValid = Object.values(item).some(
        (value) => typeof value === "string" && value.trim() !== ""
    );

    const sendAddRequest = async (token) => {
        return await fetch(`http://localhost:3000/${role}/${type}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: 'include',
            body: JSON.stringify(item),
        });
    };

    const addNewItem = async () => {
        if (!isFormValid) {
            alert("Please fill in at least one field before saving.");
            return;
        }

        let token = Cookies.get("accessToken");

        try {
            let response = await sendAddRequest(token);

            if (response.status === 401 || response.status === 403) {
                token = await refreshToken();
                response = await sendAddRequest(token);
            }

            if (!response.ok) {
                throw new Error("Failed to add item.");
            }

            const newItem = await response.json();
            addDisplay(newItem);
            setDisplayChanged(true);
            setItem(defaltValues);
            setShowAddItem(false);
        } catch (error) {
            handleError("addError", error);
        }
    };

    return (
        <>
            <button
                className={buttonClassName}
                onClick={() => setShowAddItem(true)}
                style={customStyles.button}
            >
                {buttonText || `Add ${type}`}
            </button>
            {showAddItem && (
                <div
                    className={containerClassName}
                    style={customStyles.container}
                >
                    {keys.map((key) => (
                        <div key={key} className="form-field" style={customStyles.field}>
                            <label htmlFor={key} className="form-label" style={customStyles.label}>
                                {key}:
                            </label>
                            <input
                                id={key}
                                placeholder={key}
                                value={item[key] || ""}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                className="form-input"
                                style={customStyles.input}
                            />
                        </div>
                    ))}
                    <div className="button-container" style={customStyles.buttonContainer}>
                        <button
                            className="send-button"
                            onClick={addNewItem}
                            style={customStyles.sendButton}
                        >
                            Send
                        </button>
                        <button
                            className="cancel-button"
                            onClick={() => setShowAddItem(false)}
                            style={customStyles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddItem;
