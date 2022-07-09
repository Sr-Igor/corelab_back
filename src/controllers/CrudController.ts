import {Response, Request} from "express"
import { validationResult } from "express-validator"
import * as Crud from "../services/CrudService"

export const create =  async (req: Request, res: Response) => {
    // Express-validator check all fields send in request 
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({error: errors.mapped()})
        return
    };

    // Call service
    await Crud.createService(req.body)
    res.status(201)
    res.json({})
}

export const edit =  async (req: Request, res: Response) => {
    let id = req.params.id

    // Express-validator check all fields send in request 
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({error: errors.mapped()})
        return
    };

    // Call service and verify errors
    const result = await Crud.editService(req.body, id)
    if(result instanceof Error){
        res.status(400)
        res.json({error: result.message})
        return
    }

    res.status(200)
    res.json({})
}

export const destroy =  async (req: Request, res: Response) => {
    let id = req.params.id

    // Call service and verify errors
    const result = await Crud.destroyService(id)
    if(result instanceof Error){
        res.status(400)
        res.json({error: result.message})
        return
    }

    res.status(200)
    res.json({})
}

export const favorite =  async (req: Request, res: Response) => {
    let id = req.params.id
    let option = req.body.option as boolean

    // Call service and verify errors
    const result = await Crud.favoriteService(id, option)
    if(result instanceof Error){
        res.status(400)
        res.json({error: result.message})
        return
    }
    
    res.status(200)
    res.json({})
}

export const getCars= async (req: Request, res: Response) => {
    // Call service
    let result = await Crud.getCarsService(req.query)
    res.status(200)
    res.json({cars: result})

}

export const search = async (req: Request, res: Response) => {
    let q = req.query.q as string

    // Call service
    let result = await Crud.searchService(q)
    res.status(200)
    res.json({list: result})
}

export const getColors = async (req: Request, res: Response) => {
    // Call service
    let result = await Crud.getColorsService()
    res.status(200)
    res.json({colors: result})
}

export const getYears = async (req: Request, res: Response) => {
    // Call service
    let result = await Crud.getYearsService()
    res.status(200)
    res.json({years: result})
}

export const getBrands = async (req: Request, res: Response) => {
    // Call service
    let result = await Crud.getBrandsService()
    res.status(200)
    res.json({brands: result})
}