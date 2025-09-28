import express from "express";
import { conectarDB } from "./db.js";
import calculosRouter from "./calculos.js";

conectarDB();
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hola Mundo!");
});

app.use("/rectangulos", calculosRouter);

app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});
