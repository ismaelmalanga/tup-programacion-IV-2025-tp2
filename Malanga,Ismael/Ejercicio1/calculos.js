import express from 'express';
import { validarId,verificarValidaciones,validarCalculo } from './validaciones.js';
import { db } from './db.js';

const router = express.Router();
router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM calculos');
    return res.status(200).json({success:true,data:rows});
});

router.get('/:id',validarId(),verificarValidaciones,async (req,res) =>{
    const {id} = req.params;
    const [rows] = await db.execute('SELECT * FROM calculos WHERE idcalculos = ?',[id]);
    if (rows.length === 0){
        return res.status(404).json({success:false,message:'rectangulo no encontrado'});
    }
    return res.status(200).json({success:true,data:rows[0]});
});

router.post('/',validarCalculo, verificarValidaciones,async (req,res) => {
    const {base,altura} = req.body;
    const perimetro = 2 * (parseFloat(base) + parseFloat(altura));
    const superficie = parseFloat(base) * parseFloat(altura);
    const [result] = await db.execute(
        'INSERT INTO calculos (base, altura, perimetro, superficie) VALUES (?, ?, ?, ?)',
        [base, altura, perimetro, superficie]
    );
    return res.status(201).json({
        success: true,
        data:{
            id: result.insertId,
            base,
            altura,
            perimetro,
            superficie
        }
    });
});

router.delete('/:id',validarId(),verificarValidaciones,async (req, res) => {
    const {id} = req.params;
    const [rows] = await db.execute('SELECT * FROM calculos WHERE idcalculos = ?',[id]);
    if (rows.length === 0) {
        return res.status(404).json({ success:false,message:'rectangulo no encontrado'});
    }
    await db.execute('DELETE FROM calculos WHERE idcalculos = ?', [id]);
    return res.status(200).json({success:true,message:'rectangulo eliminado'});
});

router.put('/:id', validarId(), validarCalculo, verificarValidaciones, async (req, res) => {
    const {id} = req.params;
    const {base,altura} = req.body;
    const [rows]=await db.execute('SELECT * FROM calculos WHERE idcalculos = ?',[id]);
    if (rows.length === 0) {
        return res.status(404).json({success:false,message:'rectangulo no encontrado'});
    }

    const perimetro = 2 * (parseFloat(base) + parseFloat(altura));
    const superficie = parseFloat(base) * parseFloat(altura);
    await db.execute(
        'UPDATE calculos SET base = ?, altura = ?, perimetro = ?, superficie = ? WHERE idcalculos = ?',
        [base, altura, perimetro, superficie, id]
    );
    return res.status(200).json({
        success: true,
        data:{
            id,
            base,
            altura,
            perimetro,
            superficie
        }
    });
});
export default router;