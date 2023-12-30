import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { Note } from "./entities/Note";

dotenv.config();

export default new DataSource({
    type: "postgres",
    url: process.env.CONNECTION_STRING,
    entities: [Note],
    synchronize: true,
})