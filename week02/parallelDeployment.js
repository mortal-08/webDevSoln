// DO NOT EDIT THIS FUNCTION
const pingService = (serviceName, delay) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`${serviceName} is ONLINE`);
        }, delay);
    });
};

// WRITE YOUR bootCluster FUNCTION BELOW:
const bootCluster = async () => {
    // Your Promise.all logic goes here...
    try {
        const [a, b, c] = await Promise.all([
            pingService("Redis Cache", 1000),
            pingService("PostgreSql", 2500),
            pingService("Kafka Queue", 1500)
        ])
        console.log(`${a}\n${b}\n${c}`)


    } catch (err) {
        console.error(err)
    }
}

bootCluster();