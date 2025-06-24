import { useState } from "react";

export default function useHandleDisplay(initialItems = null) {
    const [items, setItems] = useState(initialItems);

    const updateItem = (updatedFields) => {
        console.log('=== updateItem called ===');
        console.log('updatedFields:', updatedFields);
        console.log('current items:', items);

        setItems((prevItems) => {
            if (!Array.isArray(prevItems)) {
                console.warn('prevItems is not an array:', prevItems);
                return prevItems;
            }

            return prevItems.map((item) => {
                console.log('checking item:', item);

                const itemId = item.lesson_id || item.id || item.pool_id || item.user_id || item.contact_id || item.request_id;
                const updatedId = updatedFields.lesson_id || updatedFields.id || updatedFields.pool_id || updatedFields.user_id || updatedFields.contact_id || updatedFields.request_id;

                console.log('itemId:', itemId, 'updatedId:', updatedId);

                const shouldUpdate = itemId === updatedId;
                console.log('shouldUpdate:', shouldUpdate);

                if (shouldUpdate) {
                    const updated = { ...item, ...updatedFields };
                    console.log('updated item:', updated);
                    return updated;
                }
                return item;
            });
        });
    };

    const deleteItem = (deleteId) => {
        setItems((prevItems) => {
            if (!Array.isArray(prevItems)) {
                console.warn('prevItems is not an array:', prevItems);
                return prevItems;
            }

            return prevItems.filter((item) => {
                const itemId = item.lesson_id || item.id || item.pool_id || item.user_id || item.contact_id || item.request_id;
                return itemId !== deleteId;
            });
        });
    };

    const addItem = (newItem) => {
        if (!items) {
            setItems([newItem]);
        } else {
            setItems((prevItems) => {
                if (!Array.isArray(prevItems)) {
                    console.warn('prevItems is not an array:', prevItems);
                    return [newItem];
                }
                return [...prevItems, newItem];
            });
        }
    };

    return [items, setItems, updateItem, deleteItem, addItem];
}
