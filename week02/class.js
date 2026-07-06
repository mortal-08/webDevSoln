// JavaScript Classes
class ServerNode {
    constructor(name, ip, status = "ONLINE") {
        this.name = name
        this.ip = ip
        this.status = status
    }
    toggleStatus() {
        if (this.status === "ONLINE") {
            this.status = "OFFLINE"
        }
        else {
            this.status = "ONLINE"
        }
    }
}

class DatabaseNode extends ServerNode {
    constructor(name, ip, status, dbEngine) {
        super(name, ip, status)
        this.dbEngine = dbEngine
    }
}

const renderNodeCard = (node) => {
    const card = document.createElement("div")
    card.classList.add("card")

    // 2. Create, populate, and append the name
    const nameHeading = document.createElement("h3")
    nameHeading.textContent = node.name
    card.appendChild(nameHeading)

    const ip = document.createElement("p")
    ip.textContent = node.ip
    card.appendChild(ip)

    const status = document.createElement("span")
    const initialModifier = node.status === "ONLINE" ? "badge--online" : "badge--offline"
    status.classList.add("badge", initialModifier)
    status.textContent = node.status
    card.appendChild(status)

    if (node.dbEngine) {
        const dbEngine = document.createElement("p")
        dbEngine.textContent = node.dbEngine
        card.appendChild(dbEngine)
    }
    card.addEventListener("click", () => {
        node.toggleStatus()
        status.textContent = node.status
        if (node.status === "OFFLINE") {
            status.classList.replace("badge--online", "badge--offline")
        } else {
            status.classList.replace("badge--offline", "badge--online")
        }
    })

    return card
}