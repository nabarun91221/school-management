import School from "../models/school.model.js";
import sendResponse from "../shared/middlewares/responceHandlers/responce.handler.js";
import getDistance from "../shared/utils/haversineDistanceCalculation.js";
import { Sequelize } from "sequelize";
class SchoolController
{
    createSchool = async (req, res, next) =>
    {

        try {
            const school = await School.create(req.body);
            return sendResponse(res, school, "School created", 201);
        } catch (error) {
            next(error);
        }
    }
    getSchool = async (req, res, next) =>
    {
        try {
            const { id } = req.params;
            const school = await School.findByPk(id);
            if (!school) return next({ status: 404, message: `School with the id: ${id} not found` });
            return sendResponse(res, school, "School fetched successfully");

        } catch (error) {
            next(error)
        }
    }

    // *** Method 1: Application-level distance calculation
    // This approach fetches ALL school records from the database first,
    // then calculates the geographical distance (Haversine formula) in the application layer
    // and sorts the results in memory.
    //
    // Issue:
    // - Inefficient for large datasets (loads entire table into memory)
    // - Increased response time as data grows
    // - Higher CPU usage on the server
    //
    // Suitable for small datasets or initial implementation,
    // but NOT recommended for production-scale systems.


    // getSchools = async (req, res, next) =>
    // {
    //     try {
    //         const { latitude, longitude } = req.query;

    //         if (!latitude || !longitude) {
    //             return next({ status: 400, message: "Latitude & Longitude required" });
    //         }

    //         const schools = await School.findAll();

    //         const sorted = schools
    //             .map(school =>
    //             {
    //                 const data = school.toJSON();

    //                 return {
    //                     ...data,
    //                     distance: getDistance(
    //                         parseFloat(latitude),
    //                         parseFloat(longitude),
    //                         data.latitude,
    //                         data.longitude
    //                     )
    //                 };
    //             })
    //             .sort((a, b) => a.distance - b.distance);

    //         return sendResponse(res, sorted);
    //     } catch (error) {
    //         next(error)
    //     }
    // }

    //*** A better approach is to perform distance calculation and sorting at the database level. */

    getSchools = async (req, res, next) =>
    {
        try {
            const { latitude, longitude } = req.query;

            if (!latitude || !longitude) {
                return next({ status: 400, message: "Latitude & Longitude required" });
            }

            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            const schools = await School.findAll({
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`
              (6371 * acos(
                cos(radians(${lat})) *
                cos(radians(latitude)) *
                cos(radians(longitude) - radians(${lng})) +
                sin(radians(${lat})) *
                sin(radians(latitude))
              ))
            `),
                            "distance"
                        ]
                    ]
                },
                order: [[Sequelize.literal("distance"), "ASC"]]
            });

            return sendResponse(res, schools, "Schools sorted by distance");
        } catch (error) {
            next(error);
        }
    };

    updateSchool = async (req, res, next) =>
    {
        try {
            const { id } = req.params;

            const school = await School.findByPk(id);

            if (!school) {
                return next({ status: 404, message: "School not found" });
            }

            await school.update(req.body);

            return sendResponse(res, school, "School updated");
        } catch (error) {
            next(error);
        }
    };
    deleteSchool = async (req, res, next) =>
    {
        try {
            const { id } = req.params;

            const school = await School.findByPk(id);

            if (!school) {
                return next({ status: 404, message: "School not found" });
            }

            await school.destroy();

            return sendResponse(res, school, "School deleted successfully");
        } catch (error) {
            next(error);
        }
    };

}

export default new SchoolController();