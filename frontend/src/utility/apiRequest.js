const apiRequest = async (url, method, data = null) => {
    const { token } = JSON.parse(localStorage.getItem('user')) || {};

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }), // Include Authorization header if token is provided
        },
        ...(data && { body: JSON.stringify(data) }), // Include body if data is provided
    };

    try {
        //console.log('Making API request to:', url, 'with options:', options); // Debugging log
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'An error occurred');
        }
        return await response.json();
        //When an error is thrown (either from the fetch failing or from manually throwing it due to a non-ok response re-throwing the orignal error
    } catch (error) {
        //takes only one value as input
        console.error(error);
        throw error; // Re-throw the error so it can be handled by the calling function
    }
};
export default apiRequest;