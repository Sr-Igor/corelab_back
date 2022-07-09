import { connect, disconnect } from "mongoose";
import Car from "../models/car"
import * as Crud from "../services/CrudService"
import dotenv from "dotenv"

dotenv.config()

const data = {
    title: "SANDERO",
    brand: "STEPAWAY",
    price: "R$20.000",
    description: "Único dono, estado de novo",
    year: "2016",
    licensePlate: "HBR2345",
    color: "BRANCO",
}

describe ("Testing Crud", ()=> {

    beforeAll(async () => {
        await connect(process.env.MONGO_TEST_URL as string, {});
    });

    afterAll(async () => {
        await disconnect();
      });

    it("Create", async () => {
        await Crud.createService(data)
        let car = await Car.findOne({title: data.title})
        expect(car).toHaveProperty("brand")
        expect(car).toHaveProperty("price")
        expect(car).toHaveProperty("description")
        expect(car).toHaveProperty("year")
        expect(car).toHaveProperty("licensePlate")
        expect(car).toHaveProperty("color")
        expect(car).toHaveProperty("favorite")
        expect(car?.title).toBe(data.title)
        expect(car?.brand).toBe(data.brand)
        expect(car?.price).toBe(20000)
        expect(car?.description).toBe(data.description)
        expect(car?.year).toBe(2016)
        expect(car?.licensePlate).toBe(data.licensePlate)
        expect(car?.color).toBe(data.color)
        expect(car?.favorite).toBe(false)
    });

    it("Edit", async () => {
        let car = await Car.findOne({title: data.title})
        let id = car?._id.toString() as string
        data.title = "ALTERADO"
        let result = await Crud.editService(data, id)
        expect(result).not.toBeInstanceOf(Error)
        let editedCar = await Car.findOne({title: data.title})
        expect(editedCar).toHaveProperty("title")
        expect(editedCar?.title).toBe(data.title)
    });

    it("Edit ERROR (Inexistent ID)", async () => {
        let result = await Crud.editService(data, "62c6079a80ac9aab0285aac0")
        expect(result).toBeInstanceOf(Error)
    });

    it("Favorite", async () => {
        let car = await Car.findOne({brand: data.brand})
        let id = car?._id.toString() as string
        let result = await Crud.favoriteService(id, true)
        expect(result).not.toBeInstanceOf(Error)
        let favCar = await Car.findOne({brand: data.brand})
        expect(favCar?.favorite).toBe(true)
    });

    it("Get cars", async () => {
        let result = await Crud.getCarsService({})
        expect(result.length).toBe(1)
        let car = result[0]
        expect(car).toHaveProperty("brand")
        expect(car).toHaveProperty("price")
        expect(car).toHaveProperty("description")
        expect(car).toHaveProperty("year")
        expect(car).toHaveProperty("licensePlate")
        expect(car).toHaveProperty("color")
        expect(car).toHaveProperty("favorite")
        expect(car).toHaveProperty("colorBox")
        expect(car).toHaveProperty("colorText")
    })

    it("Search", async () => {
        let result = await Crud.searchService(data.brand)
        expect(result.length).toBe(1)
    })

    it("Delete", async () => {
        let car = await Car.findOne({brand: data.brand})
        let id = car?._id.toString() as string
        let result = await Crud.destroyService(id)
        expect(result).not.toBeInstanceOf(Error)
    })
})