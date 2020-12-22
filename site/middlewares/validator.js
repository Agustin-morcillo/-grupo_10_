const { body } = require("express-validator");
const fs = require("fs");
const path = require("path");
const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const allFunctions = require("../helpers/allFunctions");
const bcrypt = require("bcryptjs")

const validator = {
    login: [
        body('email')
            .custom((value, { req }) => {
                const password = req.body.password;
                const users = allFunctions.getAllusers();
                const userExist = users.find(user=>value == user.email)
                if(userExist && bcrypt.compareSync(password, userExist.password)){
                    return true;
                }
                return false;
            })
            .withMessage('Email o contraseña inválidos')
    ],
    register: [
        body('name')
        .notEmpty()
        .withMessage('Debe completar el campo: Nombre'),
        body('lastName')
        .notEmpty()
        .withMessage('Debe completar el campo: Apellido'),
        body('email')
        .notEmpty()
        .withMessage('Debe completar el campo: Email')
        .bail()
        .isEmail()
        .withMessage('El email ingresado no es válido')
        .bail()
        .custom((value)=> {
            const allUsers = allFunctions.getAllusers();
            const searchUser = allUsers.find((user) => (value == user.email))
    
            return !searchUser;
        })
        .withMessage('El usuario ya existe'),
        body('retypeEmail')
        .custom((value, {req})=> {
            return(value == req.body.email);
        })
        .withMessage ('Los email no coinciden'),
        body ('password')
        .isLength ({min:5})
        .withMessage ('La contraseña debe tener al menos 5 caracteres'),
        body('retype')
        .custom ((value, {req})=> {
            return(value == req.body.password);
        })
        .withMessage ('Las contraseñas no coinciden'),
        body('avatar')
        .custom ((value , {req}) => {
            if(req.files[0])
            {
                const imageFormats = ['.jpg', '.png', '.jpeg'];
                const userImage = path.extname (req.files[0].originalname)
                return (imageFormats.includes(userImage));
            }
            return true;
        })
        .withMessage ("Formato de imagen Inválido. Formatos válidos: '.jpg', '.png', '.jpeg'"),
    ]
}

module.exports = validator;

