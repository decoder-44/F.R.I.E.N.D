import express from 'express'
import dotenv from "dotenv";
import cors from 'cors';
import apiHandler from './api/apiHandler.js';
import { fileURLToPath } from "url";
import path from "path";
import { log } from './utils/logger.js';
import { LOG_LEVEL } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'local';

dotenv.config({ path: path.join(__dirname, `.env.${env}`) });

var app = express();
app.use(cors()); 
app.use(express.json());

apiHandler(app);

app.listen(4042);
log(
    LOG_LEVEL.INFO,
    "Running a GraphQL API server at http://localhost:4042/graphql",
    {},
    null
)