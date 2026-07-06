const pingDatabase = () => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            let num = Math.random()
            if (num > 0.5) {
                res("Database Connection Established")
            } else {
                rej("Connection Timed out")
            }
        }, 3000)
    })
}

// pingDatabase()
//     .then((data) => {
//         console.log(data)
//     })
//     .then((whatDoYouHave) => {
//         console.log(whatDoYouHave)
//     })
//     .catch((err) => {
//         console.error(err)
//     })

const deployApplication = async () => {
    try {
        const dbStatus = await pingDatabase()
        console.log(dbStatus)
        console.log("Deploying microservices")
    }
    catch (err) {
        console.error("Deployment Aborted Error:", err)
    }
}
deployApplication()
