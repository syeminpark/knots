export const extractAllValuesAndKeys = (arr) => {
    const extractedValues = {};
    const allKeys = arr
        .filter(item => !item.deleted) // Exclude soft-deleted items
        .map(item => item.name.trim()); // Extract all keys

    arr.forEach((item) => {
        if (!item.isDeleted) { // Exclude soft-deleted items
            extractedValues[item.name.trim()] = item.description; // Extract key-value pairs
        }
    });

    return { extractedValues, allKeys };
};
