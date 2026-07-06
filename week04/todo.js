const fs = require("fs").promises;
const express = require("express");
const { readFileSync, writeFileSync } = require("fs");
const app = express();

const readFile = async () => {
    const data = await fs.readFile("todos.json", "utf-8");
    return JSON.parse(data);
};
const writeFile = async (arr) => {
    const data = JSON.stringify(arr, null, 2);
    await fs.writeFile("todos.json", data);
};

app.get("/getall", async (req, res) => {
    try {
        const data = await readFile();
        res.send(data);
    } catch (err) {
        res.status(500).send("server error");
    }
});

app.get("/getbyid", async (req, res) => {
    const id = parseInt(req.query.id, 10);
    if (Number.isNaN(id)) return res.status(400).send("invalid id");
    try {
        const data = await readFile();
        const item = data.find((el) => el.id === id);
        if (!item) return res.status(404).send("not found");
        return res.json(item);
    } catch (err) {
        res.status(500).send("server error");
    }
});

app.use(express.json());

const readFilesy = () =>{
    const data = readFileSync('todos.json','utf-8')
    return JSON.parse(data)
}
const writeFilesy = (arr) =>{
    const data = JSON.stringify(arr,null,2)
    writeFileSync("todos.json",data)
}

app.post("/todos", (req, res) => {
    const name = req.body.name;
    try {
        const arr =  readFilesy();
        const id = arr.length ? arr[arr.length - 1].id + 1 : 1;
        const item = { name: name, id: id };
        arr.push(item);
        writeFilesy(arr);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).send("server err");
    }
});

app.put("/todos/:id",  (req, res) => {
    const name = req.body.name;
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).send("invalid id");
    try {
        const arr = readFilesy();
        let found = false;
        for (const el of arr) {
            if (el.id === id) {
                el.name = name;
                found = true;
                break;
            }
        }
        if (!found) return res.status(404).send("id not found");
        writeFilesy(arr);
        res.status(200).send("edit successful");
    } catch (err) {
        return res.status(500).send("sever err");
    }
});

app.delete("/delete", async (req, res) => {
    const id = parseInt(req.body?.id,10);
    if (Number.isNaN(id)) return res.status(400).send("invalid id");
    try {
        const arr = await readFile();
        const index = arr.findIndex((el) => el.id === id);
        if (index === -1) return res.status(404).send("id not found");
        arr.splice(index, 1);
        await writeFile(arr);
        res.status(200).send("delete successful")
    } catch (err) {
        res.status(500).send("server err");
    }
});

app.listen(3000);
