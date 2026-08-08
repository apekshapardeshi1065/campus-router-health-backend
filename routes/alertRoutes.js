const express = require("express");

const { readCSV } = require("../utils/csvReader");
const {
    calculateHealthScore,
    getHealthStatus
} = require("../utils/healthScore");

const router = express.Router();


router.get("/", async (req, res) => {

    try {

        const routers = await readCSV("routers.csv");
        const metrics = await readCSV("metrics.csv");

        const getId = (row) =>
            row.router_id ??
            row.routerId ??
            row.Router_ID ??
            row["Router ID"] ??
            row.id ??
            row.ID;


        const alerts = [];


        routers.forEach((router) => {

            const routerId = getId(router);

            const routerMetrics = metrics.filter(
                metric =>
                    String(getId(metric)) ===
                    String(routerId)
            );


            const latest =
                routerMetrics.length
                    ? routerMetrics[routerMetrics.length - 1]
                    : {};


            const score =
                calculateHealthScore(latest);

            const status =
                getHealthStatus(score);


            if (status === "Critical") {

                alerts.push({
                    routerId,
                    type: "CRITICAL",
                    message:
                        "Router requires immediate attention",
                    healthScore: score
                });

            } else if (status === "Warning") {

                alerts.push({
                    routerId,
                    type: "WARNING",
                    message:
                        "Router performance needs monitoring",
                    healthScore: score
                });

            }

        });


        res.json({
            success: true,
            count: alerts.length,
            data: alerts
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