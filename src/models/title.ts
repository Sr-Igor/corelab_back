import { Schema, model, connection } from 'mongoose';

type TitlesType = {
  title: string;

};

const modelSchema = new Schema<TitlesType>({
    title: String,
})

const modelName = "Titles"

export default module.exports = model(modelName, modelSchema)
