import "dotenv/config"
import express from "express";
import SchoolRouter from "./src/routes/school.route.js"
import errorHandler from "./src/shared/middlewares/responceHandlers/error.handler.js";
import { connectDB } from "./src/configs/sequelize.config.js";

const App = express();
const BaseUrl = "/api/v1"
const PORT = process.env.PORT;

App.use(express.json());
App.use(express.urlencoded());

App.use(BaseUrl, SchoolRouter);
App.use(errorHandler);

App.listen(PORT, async (e) =>
{
    if (e) {
        console.log("something is breaking...");
        process.exit(1);
    }

    await connectDB();

    console.log("server is running on port: ", PORT);

})



