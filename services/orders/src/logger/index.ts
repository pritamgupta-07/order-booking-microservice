import { Logger } from "winston";
import devLogger from "./devLogger.js";
import productionLogger from "./productionLogger.js";


const NODE_ENV = process.env.NODE_ENV;

let logger;

if (NODE_ENV === "development") {
    logger = devLogger; 
    // logger = productionLogger;
}

if(NODE_ENV === 'production'){
    logger = productionLogger;
}

export default logger as Logger;
