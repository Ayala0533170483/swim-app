export const fetchData = async (userType, typeOfItem = "", attribute = "", id = "", handleError) => {
    try {
        const pathParts = [userType, typeOfItem].filter(Boolean);
        const basePath = pathParts.join('/');
        const queryString = attribute ? `?${attribute}=${id}` : '';
        const url = `http://localhost:3000/${basePath}${queryString}`;

        const response = await fetch(url, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result?.success ? result.data : result;

    } catch (error) {
        handleError?.("getError", error);
        console.error('Error fetching data:', error);
        return null;
    }
};
