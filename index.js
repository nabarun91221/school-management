import "dotenv/config"
import express from "express";
import SchoolRouter from "./src/routes/school.route.js"
import errorHandler from "./src/shared/middlewares/responceHandlers/error.handler.js";
import { connectDB } from "./src/configs/sequelize.config.js";
import { apiReference } from "@scalar/express-api-reference";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsPath = path.join(__dirname, "./src/doc");
console.log(docsPath)

const App = express();
const BaseUrl = "/api/v1"
const PORT = process.env.PORT;


App.use("/schoolManagementOpenAPI_spec.yaml", express.static(path.join(docsPath, "schoolManagementOpenAPI_spec.yaml")));

App.use(
    "/docs",
    apiReference({
        spec: {
            url: "/schoolManagementOpenAPI_spec.yaml",
        },
        theme: "purple",
    })
);

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
    console.log(`docs is available at: http://localhost:${PORT}/docs`);

})



