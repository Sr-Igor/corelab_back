import { checkSchema } from "express-validator";

export const AuthValidator = {
    crud: checkSchema({
        title: {
           notEmpty: true,
           errorMessage: "Preencha um titúlo"
        },
        brand: {
            notEmpty: true,
            errorMessage: "Preencha uma marca"
        },
        price: {
            notEmpty: true,
            errorMessage: "Preencha um preço"
        },
        description: {
            notEmpty: true,
            errorMessage: "Preencha uma descrição"
        },
        year: {
            notEmpty: true,
            errorMessage: "Preencha um ano"
        },
        licensePlate: {
            notEmpty: true,
            errorMessage: "Preencha a placa"
        },
        color: {
            notEmpty: true,
            errorMessage: "Selecione uma cor"
        }
    }),
}