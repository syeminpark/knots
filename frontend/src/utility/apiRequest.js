const API_URL = process.env.REACT_APP_API_URL || ''; // Fallback to empty string if undefined
console.log('API URL', API_URL)
// JSON API Request Function
export const apiRequest = async (url, method, data = null) => {
    const user = JSON.parse(localStorage.getItem('user')) || {}; // Safe access to localStorage
    const { token } = user;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }), // Add Authorization header only if token exists
        },
        ...(data && { body: JSON.stringify(data) }), // Add body only if data exists
    };

    try {
        const fullUrl = API_URL ? API_URL + url : url; // Correct URL fallback
        const response = await fetch(fullUrl, options);

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'An error occurred');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in API request:', error);
        throw error; // Re-throw to let the calling function handle it
    }
};

// FormData API Request Function
export const apiRequestFormData = async (url, method, formData) => {
    const user = JSON.parse(localStorage.getItem('user')) || {}; // Safe access to localStorage
    const { token } = user;

    const options = {
        method,
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }), // Add Authorization header only if token exists
        },
        body: formData, // FormData as body
    };

    try {
        const fullUrl = API_URL ? API_URL + url : url; // Correct URL fallback
        const response = await fetch(fullUrl, options);

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'An error occurred');
        }

        return await response.json();
    } catch (error) {
        console.error('Error in FormData API request:', error);
        throw error;
    }
};

export default apiRequest;
