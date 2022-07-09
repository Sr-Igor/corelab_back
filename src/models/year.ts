import { Schema, model, connection } from 'mongoose';

type YearsType = {
  year: number;

};

const modelSchema = new Schema<YearsType>({
    year: Number,
})

const modelName = "Years"

export default module.exports = model(modelName, modelSchema)
