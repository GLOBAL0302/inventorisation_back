import express from "express";
import mysqlDb from "../mysqlDb";
import {ResultSetHeader} from "mysql2";
import {ICategory, ILocation} from "../types";

const locationRouter = express.Router();


locationRouter.get("/", async (req, res) => {
    const result = await  mysqlDb.getConnection().query(
        'SELECT * FROM location'
    );
    const locations = result[0] as ILocation[];
    return res.send(locations)
})

locationRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const result = await mysqlDb.getConnection().query(
        'SELECT * FROM location WHERE id = ?',
        [id]
    )
    const locations = result[0] as ILocation[];
    if(locations.length == 0){
        res.status(404).send("No location found.");
    }
    res.send(locations[0])
})

locationRouter.post("/", async (req, res) => {
    if(!req.body.title){
        return res.status(400).send("No title found in location.");
    }

    const newLocation = {
        title: req.body.title,
        description: req.body.description? req.body.description : "",
    }

    const insertResult = await mysqlDb.getConnection().query(
        'INSERT INTO location (title, description) VALUES (?,?)',
        [newLocation.title, newLocation.description],
    )

    const resultHeader =  insertResult[0] as ResultSetHeader;
    const getNewResult = await mysqlDb.getConnection().query(
        'SELECT * FROM location WHERE id = ?',
        [resultHeader.insertId]
    )

    const locations = getNewResult[0] as ILocation[];
    return res.send(locations[0])
})


locationRouter.delete("/:id", async (req, res) => {
    const id = req.params.id;

    const result = await mysqlDb.getConnection().query(
        'SELECT * FROM records where location_id = ?',
        [id]
    )
    const location_id = result[0] as ICategory[];
    if (location_id[0]) {
        res.status(404).send("can not delete the bound location");
    }
    const deleted =  await mysqlDb.getConnection().query(
        'DELETE FROM location where id = ?',
        [id]
    )

    res.send(`Deleted location by ID ${id}`)
})

locationRouter.put("/:id", async (req, res) => {
    const updates = {
        id: req.params.id,
        title: req.body.title,
        description: req.body.description,
    }

    const result = await mysqlDb.getConnection().query(
        'UPDATE location SET title = ?, description = ? WHERE id = ?',
        [updates.title, updates.description, updates.id],
    )
    res.send(updates)
})

export default locationRouter;