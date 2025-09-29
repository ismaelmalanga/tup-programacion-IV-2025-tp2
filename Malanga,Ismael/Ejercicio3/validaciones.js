import { param, body, validationResult } from "express-validator";
export const validarId = () =>
    param("id")
        .isInt({ min: 1 })
        .withMessage("El ID debe ser un numero entero mayor a 0");

export const validarAlumno = [
    body("nombre")
        .exists().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser un texto")
        .isLength({ min: 3 }).withMessage("El nombre debe tener 3 caracteres minimo")
        .trim(),
    body("nota1")
        .exists().withMessage("La nota 1 es obligatoria")
        .isFloat({ min: 0, max: 10 }).withMessage("La nota 1 debe ser un numero entre 0 y 10"),
    body("nota2")
        .exists().withMessage("La nota 2 es obligatoria")
        .isFloat({ min: 0, max: 10 }).withMessage("La nota 2 debe ser un numero entre 0 y 10"),
    body("nota3")
        .exists().withMessage("La nota 3 es obligatoria")
        .isFloat({ min: 0, max: 10 }).withMessage("La nota 3 debe ser un numero entre 0 y 10"),
    body("id_materia")
        .exists().withMessage("La materia es obligatoria")
        .isInt({ min: 1 }).withMessage("El id_materia debe ser un numero entero mayor a 0")
];

export const validarMateria = [
    body("nombre")
        .exists().withMessage("El nombre es obligatorio")
        .isString().withMessage("El nombre debe ser un texto")
]
export const verificarValidaciones = (req, res, next) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Falla de validacion",
            errors: validacion.array(),
        });
    }
    next();
};