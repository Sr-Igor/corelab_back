import { Schema, model, connection } from 'mongoose';

type ColorsType = {
  color: string;
  colorBox: string;
  colorText: string;
};

const modelSchema = new Schema<ColorsType>({
    color: String,
    colorBox: String,
    colorText: String,
})

const modelName = "Colors"

export default module.exports = model(modelName, modelSchema)
