export const fetchData = async (userType, typeOfItem, attribute, id = "", handleError) => {
    try {
        const response = await fetch(`http://localhost:3000/${userType}/${typeOfItem}/?${attribute}=${id}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        if (result.success && result.data) {
            return result.data;

        } else {
            throw new Error("No user found with that ID");
        }
    } catch (error) {
        handleError("getError", error)
    }
};