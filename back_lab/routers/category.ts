import express from "express";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";
import {ICategory} from "../types";


const categoryRouter = express.Router();

categoryRouter.get("/", async (req, res) => {
    const result = await mysqlDb.getConnection().query(
        'SELECT * FROM category'
    );
    const categories = result[0] as ICategory[];
    return res.send(categories)
})

categoryRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query(
        'SELECT * FROM category WHERE id = ?',
        [id]
    )
    const categories = result[0] as ICategory[];
    if (categories.length == 0) {
        res.status(404).send("No category found.");
    }
    res.send(categories[0])
})

categoryRouter.post("/", async (req, res) => {
    if (!req.body.title) {
        return res.status(400).send("No title found.");
    }

    const newCategory = {
        title: req.body.title,
        description: req.body.description ? req.body.description : "",
    }

    const insertResult = await mysqlDb.getConnection().query(
        'INSERT INTO category (title, description) VALUES (?,?)',
        [newCategory.title, newCategory.description],
    )

    const resultHeader = insertResult[0] as ResultSetHeader;
    const getNewResult = await mysqlDb.getConnection().query(
        'SELECT * FROM category WHERE id = ?',
        [resultHeader.insertId]
    )

    const categories = getNewResult[0] as ICategory[];
    return res.send(categories[0])
})

categoryRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;

    const result = await mysqlDb.getConnection().query(
        'SELECT * FROM records where category_id = ?',
        [id]
    )
    const category_id = result[0] as ICategory[];
    if (category_id[0]) {
        res.status(404).send("can not delete the bound category");
    }
    const deleted =  await mysqlDb.getConnection().query(
        'DELETE FROM category where id = ?',
        [id]
    )

    res.send(`Deleted category by ID ${id}`)
})

categoryRouter.put("/:id", async (req, res) => {
    const updates = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
    }

    const result = await mysqlDb.getConnection().query(
        'UPDATE category SET title = ?, description = ? WHERE id = ?',
        [updates.title, updates.description, updates.id],
    )
    res.send(updates)
})


export default categoryRouter;