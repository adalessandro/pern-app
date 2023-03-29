import { Sequelize } from "sequelize-typescript";

import { Job } from "../models/job";
import { User } from "../models/user";

const connection = new Sequelize({
  repositoryMode: false, 
  dialect: "postgres",
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
  //logging: console.log,
  logging: false,
});

connection.addModels([Job, User]);

export const jobRepository = connection.getRepository(Job)


export default connection;