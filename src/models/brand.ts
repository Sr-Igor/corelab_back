import { Schema, model, connection } from 'mongoose';

type BrandsType = {
  brand: string;

};

const modelSchema = new Schema<BrandsType>({
    brand: String,
})

const modelName = "Brands"

export default module.exports = model(modelName, modelSchema)
