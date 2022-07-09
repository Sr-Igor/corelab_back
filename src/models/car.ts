import { Schema, model, connection } from 'mongoose';

export type CarsType = {
  title: string;
  brand: string;
  price: number;
  description: string;
  year: number;
  licensePlate: string;
  color: string;
  favorite: boolean;
  date: Date
};

const modelSchema = new Schema<CarsType>({
    title: String,
    brand: String,
    price: Number,
    description: String,
    year: Number,
    licensePlate: String,
    color: String,
    favorite: Boolean,
    date: Date,
})

const modelName = "Cars"

export default module.exports = model(modelName, modelSchema)
