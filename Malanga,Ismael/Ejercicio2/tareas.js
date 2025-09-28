import express from 'express';
import { db } from './db.js';
import { validarId, validarTarea, verificarValidaciones } from './validaciones.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { completada } = req.query; 

    let query = 'SELECT * FROM tareas';
    let params = [];

    if (completada !== undefined) {
        const estado = completada === true || completada === 'true' ? 1 : 0;
        query += ' WHERE completada = ?';
        params.push(estado);
    }

    const [rows] = await db.execute(query, params);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No hay tareas' });
    }

    const tareas = rows.map(t => ({
        ...t,
        completada: !!t.completada
    }));

    return res.status(200).json({ success: true, data: tareas });
});

router.get('/:id', validarId(), verificarValidaciones, async (req, res) => {
    const { id } = req.params;

    const [rows] = await db.execute('SELECT * FROM tareas WHERE idtareas = ?', [id]);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }
    return res.status(200).json({ success: true, data: rows[0] });
});


router.post('/', validarTarea, verificarValidaciones, async (req, res) => {
    const { nombre, completada = 0 } = req.body;
    const [existe] = await db.execute('SELECT * FROM tareas WHERE nombre = ?', [nombre]);
    if (existe.length > 0) {
        return res.status(400).json({ success: false, message: 'Ya existe esa tarea' });
    }

    const [result] = await db.execute(
        'INSERT INTO tareas (nombre, completada) VALUES (?, ?)',
        [nombre, completada]
    );

    return res.status(201).json({
        success: true,
        data: { id: result.insertId, nombre, completada: !!completada }
    });
});


router.delete('/:id', validarId(), verificarValidaciones, async (req, res) => {
    const { id } = req.params;
    const [rows] = await db.execute('SELECT * FROM tareas WHERE idtareas = ?', [id]);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    await db.execute('DELETE FROM tareas WHERE idtareas = ?', [id]);
    return res.status(200).json({ success: true, data: { id } });
});

router.put('/:id', validarId(), validarTarea, verificarValidaciones, async (req, res) => {
    const { id } = req.params;
    const { nombre, completada } = req.body;
    const [rows] = await db.execute('SELECT * FROM tareas WHERE idtareas = ?', [id]);
    if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    await db.execute('UPDATE tareas SET nombre = ?, completada = ? WHERE idtareas = ?', [nombre, completada, id]);
    return res.status(200).json({ success: true, data: { id, nombre, completada } });
});


export default router;