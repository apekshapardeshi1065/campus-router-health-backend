


const express = require("express");

const { readCSV } = require("../utils/csvReader");

const {
    calculateHealthScore
} = require("../utils/healthScore");

const router = express.Router();


router.get("/", async (req, res) => {

    try {

        const routers =
            await readCSV("routers.csv");


        const metrics =
            await readCSV("metrics.csv");


        // Get unique router IDs from metrics
        const routerIds =
            [
                ...new Set(
                    metrics.map(
                        item => item.router_id
                    )
                )
            ];


        const result =
            routerIds.map(routerId => {

                const routerMetrics =
                    metrics.filter(
                        item =>
                            item.router_id ===
                            routerId
                    );


                // Latest record
                const latest =
                    routerMetrics[
                        routerMetrics.length - 1
                    ];


                const health =
                    calculateHealthScore(
                        latest
                    );


                // Find router information
                const routerInfo =
                    routers.find(
                        item =>
                            item.router_id ===
                            routerId
                    ) || {};


                return {

                    ...routerInfo,

                    ...latest,

                    router_id:
                        routerId,

                    healthScore:
                        health.score,

                    status:
                        health.status

                };

            });


        res.json({

            success: true,

            count: result.length,

            data: result

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});



router.get("/:id", async (req, res) => {

    try {

        const metrics =
            await readCSV("metrics.csv");


        const routerId =
            req.params.id;


        const routerMetrics =
            metrics.filter(
                item =>
                    item.router_id ===
                    routerId
            );


        if (routerMetrics.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    `Router ${routerId} not found`

            });

        }


        const latest =
            routerMetrics[
                routerMetrics.length - 1
            ];


        const health =
            calculateHealthScore(
                latest
            );


        res.json({

            success: true,

            data: {

                ...latest,

                healthScore:
                    health.score,

                status:
                    health.status

            }

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});


module.exports = router;
