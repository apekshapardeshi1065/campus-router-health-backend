const express = require("express");

const { readCSV } = require("../utils/csvReader");
const { calculateHealthScore } = require("../utils/healthScore");

const router = express.Router();


router.get("/", async (req, res) => {

    try {

        const metrics = await readCSV("metrics.csv");

        const routerMap = {};


        // Group by router
        metrics.forEach((item) => {

            const routerId = item.router_id;

            if (!routerId) return;


            if (!routerMap[routerId]) {

                routerMap[routerId] = {

                    latency: [],
                    packetLoss: [],
                    throughput: [],
                    disconnects: []

                };

            }


            routerMap[routerId].latency.push(
                Number(item.latency_ms || 0)
            );

            routerMap[routerId].packetLoss.push(
                Number(item.packet_loss_pct || 0)
            );

            routerMap[routerId].throughput.push(
                Number(item.avg_speed_mbps || 0)
            );

            routerMap[routerId].disconnects.push(
                Number(item.disconnects || 0)
            );

        });


        const average = (arr) => {

            if (arr.length === 0) return 0;

            return arr.reduce(
                (sum, value) => sum + value,
                0
            ) / arr.length;

        };


        const healthData =
            Object.entries(routerMap).map(
                ([routerId, data]) => {


                    const health =
                        calculateHealthScore({

                            latency_ms:
                                average(data.latency),

                            packet_loss_pct:
                                average(data.packetLoss),

                            avg_speed_mbps:
                                average(data.throughput),

                            disconnects:
                                average(data.disconnects)

                        });


                    return {

                        router_id: routerId,

                        score: health.score,

                        status: health.status

                    };

                }
            );


        res.json({

            success: true,

            count: healthData.length,

            data: healthData

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