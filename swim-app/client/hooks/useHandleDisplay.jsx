import React, { useState } from "react";

export default function useHandleDisplay(initialItems = null) {
    const [items, setItems] = useState(initialItems);

    const updateItem = (updatedFields) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.lesson_id === (updatedFields.lesson_id || updatedFields.id)
                    ? { ...item, ...updatedFields }
                    : item
            )
        );
    };


     const deleteItem = (deleteId) => {
        setItems((prevItems) => 
            prevItems.filter((item) => {
                const itemId = item.lesson_id || item.id || item.pool_id || item.user_id;
                return itemId !== deleteId;
            })
        );
    };

    const addItem = (newItem) => {
        if (!items) {
            setItems([newItem]);
        }
        else { setItems((prevItems) => [...prevItems, newItem]); }
    };

    return [items, setItems, updateItem, deleteItem, addItem];
}