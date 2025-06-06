import React, { useState, useContext } from "react";
import { FaPen } from "react-icons/fa";
// import "../styles/Update.css";
import useHandleError from "./useHandleError";
import { updateData } from "../js-files/GeneralRequests";
import { userContext } from './App';

function Update({ item, updateDisplay, setDisplayChanged = () => {}, editableFields = [] }) {
    const [showUpdateDetails, setShowUpdateDetails] = useState(false);
    const [updatedItem, setUpdatedItem] = useState(item);
    const { handleError } = useHandleError();
    const { userData } = useContext(userContext);

    const handleInputChange = (key, value) => {
        setUpdatedItem((prevItem) => ({
            ...prevItem,
            [key]: value,
        }));
    };

    async function updateItem() {
        try {
            let response = await updateData(
                userData.type_name, 
                "users", 
                item.user_id, 
                { ...item, ...updatedItem }, 
                handleError
            );
            
            if (response) {
                const updatedData = { ...item, ...updatedItem };
                updateDisplay(updatedData);
                setShowUpdateDetails(false);
                setDisplayChanged(true);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }

    const handleCancel = () => {
        setUpdatedItem(item);
        setShowUpdateDetails(false);
    };

    return (
        <>
            <FaPen className="edit-icon" onClick={() => setShowUpdateDetails(true)} />
            {showUpdateDetails && (
                <div className="overlay">
                    <div className="modal">
                        <h2>עריכת פרופיל</h2>
                        {editableFields.map((key) => (
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
                        ))}
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                            <button onClick={updateItem} className="btn-primary">עדכן</button>
                            <button onClick={handleCancel} className="btn-primary">ביטול</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Update;
