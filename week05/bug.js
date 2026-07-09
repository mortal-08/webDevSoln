async function fetchActiveClusters() {
    try {
        const response = await fetch('https://api.internal-devops.com/v1/clusters', {
            method: 'POST',
            body: JSON.stringify({ role: "admin" }),
            headers: { 'Authorization': 'Bearer token_123' }
        })
    
        if(!response.ok){
            throw new Error(`HTTP Error! Status:${response.status}`)
        }

        const data = await response.json();
        console.log("Active Clusters Loaded:", data);
        return data;
    } catch (error) {
        console.error("Critical Failure: Could not load clusters", error);
        alert("System Offline!");
    }
}

const responseTimesMs = [100.5, 200.8, 300.2];

// We want to round these floating-point numbers down to integers: [100, 200, 300]
// A developer attempts to pass Math.floor directly as a memory reference:
const roundedTimes = responseTimesMs.map(Math.floor);

console.log(roundedTimes);

const rawStrings = ['10', '10', '10'];

// Passing parseInt directly as the transformation callback
const cleanNumbers = rawStrings.map(parseInt);

console.log(cleanNumbers); //will return [10,NaN,2]