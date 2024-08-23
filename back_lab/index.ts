import express from "express";
import config from "./config";
import cors, {CorsOptions} from "cors";
import categoryRouter from "./routers/category";
import mysqlDb from "./mysqlDb";


const app = express()
const port  = 8000;


app.use(cors(config.corsOptions))
app.use(express.json())
app.use(express.static("public"));
app.use("/category", categoryRouter);

const run = async()=>{
    await mysqlDb.init();

    app.listen(port, ()=>{
        console.log(`Server running on port: ${port}`);
    })
}

run().catch(console.error);