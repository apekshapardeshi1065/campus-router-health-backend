
const express = require("express");

const { readCSV } = require("../utils/csvReader");

const {
    calculateHealthScore
} = require("../utils/healthScore");

const router = express.Router();



router.get("/", async (req, res) => {

    try {

        // Read REAL CSV data
        const metrics =
            await readCSV("metrics.csv");


        if (!metrics.length) {

            return res.json({

                success: true,

                totalRouters: 0,

                healthy: 0,

                warning: 0,

                critical: 0,

                averageLatency: 0,

                averagePacketLoss: 0,

                averageThroughput: 0,

                ranking: []

            });

        }


  

        const routerIds = [
            ...new Set(
                metrics.map(
                    item => item.router_id
                )
            )
        ];


       

        const routerResults =
            routerIds.map(routerId => {

                const routerMetrics =
                    metrics.filter(
                        item =>
                            item.router_id ===
                            routerId
                    );


                // Average values for router
                const totalLatency =
                    routerMetrics.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.latency_ms || 0
                            ),
                        0
                    );


                const totalPacketLoss =
                    routerMetrics.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.packet_loss_pct || 0
                            ),
                        0
                    );


                const totalThroughput =
                    routerMetrics.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.avg_speed_mbps || 0
                            ),
                        0
                    );


                const totalDisconnects =
                    routerMetrics.reduce(
                        (sum, item) =>
                            sum +
                            Number(
                                item.disconnects || 0
                            ),
                        0
                    );


                const count =
                    routerMetrics.length;


                const avgLatency =
                    totalLatency / count;


                const avgPacketLoss =
                    totalPacketLoss / count;


                const avgThroughput =
                    totalThroughput / count;


                const avgDisconnects =
                    totalDisconnects / count;


                // Calculate health score
                const health =
                    calculateHealthScore({

                        latency_ms:
                            avgLatency,

                        packet_loss_pct:
                            avgPacketLoss,

                        avg_speed_mbps:
                            avgThroughput,

                        disconnects:
                            avgDisconnects

                    });


                return {

                    router_id:
                        routerId,

                    latency:
                        Number(
                            avgLatency.toFixed(2)
                        ),

                    packetLoss:
                        Number(
                            avgPacketLoss.toFixed(2)
                        ),

                    throughput:
                        Number(
                            avgThroughput.toFixed(2)
                        ),

                    disconnects:
                        Number(
                            avgDisconnects.toFixed(2)
                        ),

                    healthScore:
                        health.score,

                    status:
                        health.status

                };

            });


        

        const healthy =
            routerResults.filter(
                router =>
                    router.status ===
                    "Healthy"
            ).length;


        const warning =
            routerResults.filter(
                router =>
                    router.status ===
                    "Warning"
            ).length;


        const critical =
            routerResults.filter(
                router =>
                    router.status ===
                    "Critical"
            ).length;


     

        const totalLatency =
            metrics.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.latency_ms || 0
                    ),
                0
            );


        const totalPacketLoss =
            metrics.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.packet_loss_pct || 0
                    ),
                0
            );


        const totalThroughput =
            metrics.reduce(
                (sum, item) =>
                    sum +
                    Number(
                        item.avg_speed_mbps || 0
                    ),
                0
            );


        const averageLatency =
            totalLatency /
            metrics.length;


        const averagePacketLoss =
            totalPacketLoss /
            metrics.length;


        const averageThroughput =
            totalThroughput /
            metrics.length;


     

        const ranking =
            [...routerResults]
                .sort(
                    (a, b) =>
                        b.healthScore -
                        a.healthScore
                )
                .map(
                    (router, index) => ({

                        rank:
                            index + 1,

                        router_id:
                            router.router_id,

                        healthScore:
                            router.healthScore,

                        status:
                            router.status,

                        latency:
                            router.latency,

                        packetLoss:
                            router.packetLoss,

                        throughput:
                            router.throughput

                    })
                );


       
        res.json({

            success: true,

            totalRouters:
                routerResults.length,

            healthy,

            warning,

            critical,

            averageLatency:
                Number(
                    averageLatency.toFixed(2)
                ),

            averagePacketLoss:
                Number(
                    averagePacketLoss.toFixed(2)
                ),

            averageThroughput:
                Number(
                    averageThroughput.toFixed(2)
                ),

            ranking

        });


    } catch (error) {

        console.error(
            "Analytics Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

});


module.exports = router;
