import Car from "../models/car"
import Year from "../models/year"
import Brand from "../models/brand"
import Color from "../models/color"

type Data = {
    title: string
    brand: string
    price: string
    description: string
    year: string
    licensePlate: string
    color: string
}

type Options = {
    brand?: string
    color?: string
    year?: string|number
    maxValue?: string
    minValue?: string
    price?: Price
    limit?: string
    offSet?: string
    sort?: string
}

type Price = {
    $gte?:number
    $lte?:number
}


export const createService = async (data: Data) => {
    // Format fields
    let price =  parseFloat(data.price.replace(".", "").replace(",", ".").replace("R$",""))
    let year = Number(data.year)

    // Create elemente in database
    const newCar = new Car({
        title: data.title.toUpperCase(),
        brand: data.brand.toUpperCase(),
        price,
        description: data.description,
        year,
        licensePlate: data.licensePlate.toUpperCase(),
        color: data.color.toUpperCase(),
        date: new Date(),
        favorite: false
    })
    await newCar.save()

    // Verify existent year in collection
    let existentYear = await Year.findOne({year})
    if(!existentYear){
        const newYear = new Year({year})
        await newYear.save()
    }

    // Verify existent brand in collection
    let brand = data.brand.toUpperCase()
    let existentBrand = await Brand.findOne({brand})
    if(!existentBrand){
        const newBrand = new Brand({brand})
        await newBrand.save()
    }
    return
}

export const editService = async (data: Data, id: string) => {
    let car = await Car.findById(id)
    if(!car){
        return new Error ("Desculpe! Não foi possível localizar esse veículo")
    }

    // Select existent fields and upadte current elemente
    let updates = car

    if(data.title){
        updates.title = data.title.toUpperCase()
    }

    if(data.brand){
        updates.brand = data.brand.toUpperCase()

        // Checks if there is only one reference of the changed brand
        let oldBrand = car.brand
        let unicBrand = await Car.find({oldBrand})
        if(unicBrand.length <= 1) {
            await Brand.findOneAndDelete({oldBrand})
        }

        // Checks if there is already a reference to the new brand
        let brand = data.brand.toUpperCase()
        let existentBrand = await Brand.findOne({brand})
        if(!existentBrand){
            const newBrand = new Brand({brand})
            await newBrand.save()
        }
    }

    if(data.price){
        let price =  parseFloat(data.price.replace(".", "").replace(",", ".").replace("R$",""))
        updates.price = price
    }

    if(data.description){
        updates.description = data.description
    }

    if(data.year){
        let year = Number(data.year)
        updates.year = year

        // Checks if there is only one reference of the changed year
        let oldYear = car.year
        let unicYear = await Car.find({oldYear})
        if(unicYear.length <= 1) {
            await Year.findOneAndDelete({oldYear})
        }

        // Checks if there is already a reference to the new year
        let newYear = await Year.findOne({year})
        if(!newYear){
            const newYear = new Year({year})
            await newYear.save()
        }
    }

    if(data.licensePlate){
        updates.licensePlate = data.licensePlate.toUpperCase()
    }

    if(data.color){
        updates.color = data.color.toUpperCase()
    }

    await Car.findByIdAndUpdate(id, {$set: updates})
    return
}

export const destroyService = async (id: string) => {
    let car = await Car.findById(id)
    if(!car){
        return new Error ("Desculpe! Não foi possível localizar esse veículo")
    }

    // Check if there is only one brand reference
    let brand = car.brand
    let unicBrand = await Car.find({brand})
    if(unicBrand.length <= 1) {
        await Brand.findOneAndDelete({brand})
    }

    // Check if there is only one year reference
    let year = car.year
    let unicYear = await Car.find({year})
    if(unicYear.length <= 1) {
        await Year.findOneAndDelete({year})
    }

    await Car.findByIdAndDelete(id)
    return
}

export const favoriteService = async (id: string, option: boolean) => {
    let car = await Car.findById(id)
    if(!car){
        return new Error ("Desculpe! Não foi possível localizar esse veículo")
    }

    car.favorite = (option === true)?true:false
    await car.save()
    return
}

export const getCarsService = async (data: Options) => {
    let options: Options = {}

    // Options formatting
    if(data.brand){
        options.brand = data.brand
    }

    if(data.color){
        options.color = data.color
    }

    if(data.year){
        options.year = Number(data.year)
    }

    if(data.minValue){
        let min =  parseFloat(data.minValue.replace(".", "").replace(",", ".").replace("R$",""))
        options.price = {$gte:min}
    }

    if(data.maxValue){
        let max =  parseFloat(data.maxValue.replace(".", "").replace(",", ".").replace("R$",""))
        options.price ={$lte:max}
    }

    if(data.minValue && data.maxValue){
        let min = parseFloat(data.minValue.replace(".", "").replace(",", ".").replace("R$",""))
        let max =  parseFloat(data.maxValue.replace(".", "").replace(",", ".").replace("R$",""))

        if(max && min){
            if(min > max){
                return new Error("O valor mínimo não pode ser maior que o máximo")
            }
        }
        options.price = {$gte:min, $lte:max}
    }

    let limit = 8
    if(data.limit) {
        limit = Number(data.limit)
    }

    let offSet = 0
    if(data.offSet){
        offSet = Number(data.offSet)
    }

    let sort = "ASC"
    if(data.sort){
        sort = data.sort 
    }

    // Request
    let cars = await Car.find(options)
    .sort({date: (sort === "ASC"?1:-1)})
    .skip(offSet)
    .limit(limit)

    let allCars: any = []
    for (let i in cars){
        // Inclusion of reference colors for box and text
        let carColor = cars[i].color
        let color = await Color.findOne({color: carColor})

        let colorBox: string = ""
        let colorText: string = ""

        if(color){
            colorBox =color.colorBox
            colorText = color.colorText
        }

        allCars.push({
            id: cars[i]._id,
            title: cars[i].title,
            brand: cars[i].brand,
            price: cars[i].price,
            description: cars[i].description,
            year: cars[i].year,
            licensePlate: cars[i].licensePlate,
            color: cars[i].color,
            colorBox,
            colorText,
            favorite: (cars[i].favorite)?true:false,
        })
    }

    return allCars
}

export const searchService = async (q: string) => {
    // Array containing all possible search options
    let options: any = [
        {title : {'$regex': q, '$options': 'i'}},
        {brand: q},
        {description : {'$regex': q, '$options': 'i'}},
        {licensePlate : q.toUpperCase()},
        {color: q.toUpperCase()}
    ]

    // If it is possible to extract a number from the query
    if(Number(q)){
        options.push(
            {price: Number(q)},
            {year : Number(q)},
        )
    }

    // Request
    let cars = await Car.find({$or : options})

    let allCars: any = []
    for (let i in cars){
        // Inclusion of reference colors for box and text
        let carColor = cars[i].color
        let color = await Color.findOne({color: carColor})

        let colorBox: string = ""
        let colorText: string = ""

        if(color){
            colorBox =color.colorBox
            colorText = color.colorText
        }
        
        allCars.push({
            id: cars[i]._id,
            title: cars[i].title,
            brand: cars[i].brand,
            price: cars[i].price,
            description: cars[i].description,
            year: cars[i].year,
            licensePlate: cars[i].licensePlate,
            color: cars[i].color,
            colorBox,
            colorText,
            favorite: (cars[i].favorite)?true:false,
        })
    }

    return allCars
}

export const getColorsService = async () => {
    let colors = await Color.find()
    return colors
}

export const getYearsService = async () => {
    let colors = await Year.find().sort({year: 1})
    return colors
}

export const getBrandsService = async () => {
    let colors = await Brand.find().sort({brand: 1})
    return colors
}