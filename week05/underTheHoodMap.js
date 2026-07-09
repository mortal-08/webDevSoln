/**
 * Custom Map Polyfill (Higher-Order Function)
 * @param {Array} arr - The source array to transform
 * @param {Function} transformFn - The callback executing on each element
 * @returns {Array} - A newly allocated transformed array
 */
const customMap = (arr, transformFn) => {
    // Guard Clause: Ensure inputs match expected data types
    if (!Array.isArray(arr) || typeof transformFn !== 'function') {
        throw new TypeError('Invalid arguments passed to customMap');
    }

    // Allocate a new array in memory (Time Complexity: O(N), Space Complexity: O(N))
    const transformedArray = [];

    // Iterate imperatively under the hood
    for (let i = 0; i < arr.length; i++) {
        // Execute callback passing: current element, current index, and original array reference
        const result = transformFn(arr[i], i, arr); //every transform fn takes 3 args, first is element, 2nd is index and 3rd is array itself
        transformedArray.push(result);
    }

    // Return the new memory reference without mutating the original 'arr'
    return transformedArray;
};

// --- Execution Verification ---
const rawServerMetrics = [10, 50, 200, 404];

// Transforming raw HTTP codes into status labels
const statusLabels = customMap(rawServerMetrics, (code) => {
    return code >= 400 ? `CRITICAL_${code}` : `OK_${code}`;
});

console.log(statusLabels); // Output: [ 'OK_10', 'OK_50', 'OK_200', 'CRITICAL_404' ]
console.log(rawServerMetrics); // Original array remains untouched in memory!