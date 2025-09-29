import express from "express";
import { conectarDB } from "./db.js";
import alumnosRouter from "./alumnos.js";
import materiasRouter from "./materias.js";

conectarDB();
const app = express();
const port = 3000;


app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hola Mundo!");
});


app.use("/alumnos", alumnosRouter);
app.use("/materias", materiasRouter);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La aplicación está funcionando en el puerto ${port}`);
});
