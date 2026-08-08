

const express = require("express");

const { readCSV } = require("../utils/csvReader");

const {
    calculateHealthScore,
    getHealthStatus
} = require("../utils/healthScore");

const router = express.Router();



function number(value) {
    const n = parseFloat(value);

    return Number.isNaN(n) ? 0 : n;
}

function getId(row) {
    return (
        row.router_id ??
        row.routerId ??
        row.Router_ID ??
        row["Router ID"] ??
        row.id ??
        row.ID
    );
}

function getMetric(row, names) {
    for (const name of names) {
        if (
            row[name] !== undefined &&
            row[name] !== null &&
            row[name] !== ""
        ) {
            return row[name];
        }
    }

    return 0;
}

function average(values) {
    if (!values.length) return 0;

    return (
        values.reduce(
            (sum, value) =>
                sum + number(value),
            0
        ) / values.length
    );
}


router.get("/", async (req, res) => {

    try {

        const routers =
            await readCSV("routers.csv");

        const metrics =
            await readCSV("metrics.csv");

        console.log(
            "Routers:",
            routers.length
        );

        console.log(
            "Metrics:",
            metrics.length
        );

      

        const result = routers.map((routerData) => {

            const id = getId(routerData);

            const routerMetrics =
                metrics.filter(
                    (metric) =>
                        String(getId(metric)) ===
                        String(id)
                );

            // Last metric record
            const latest =
                routerMetrics.length > 0
                    ? routerMetrics[
                        routerMetrics.length - 1
                    ]
                    : {};

          
            const score =
                calculateHealthScore(latest);

            const status =
                getHealthStatus(score);

            return {

                ...routerData,

                ...latest,

                router_id: id,

                healthScore: score,

                status: status,

                latency: getMetric(
                    latest,
                    [
                        "latency",
                        "Latency",
                        "latency_ms",
                        "Latency_ms"
                    ]
                ),

                packet_loss: getMetric(
                    latest,
                    [
                        "packet_loss",
                        "packetLoss",
                        "packet_loss_percent",
                        "Packet_Loss"
                    ]
                ),

                throughput: getMetric(
                    latest,
                    [
                        "throughput",
                        "Throughput",
                        "throughput_mbps",
                        "Throughput_Mbps"
                    ]
                )
            };
        });

  

        const healthy =
            result.filter(
                (r) =>
                    r.status === "Healthy"
            ).length;

        const warning =
            result.filter(
                (r) =>
                    r.status === "Warning"
            ).length;

        const critical =
            result.filter(
                (r) =>
                    r.status === "Critical"
            ).length;


        const latency =
            result.map(
                (r) => r.latency
            );

        const packetLoss =
            result.map(
                (r) => r.packet_loss
            );

        const throughput =
            result.map(
                (r) => r.throughput
            );

       

        const topRouters =
            [...result]
                .sort(
                    (a, b) =>
                        b.healthScore -
                        a.healthScore
                )
                .slice(0, 10);

       

        res.json({

            success: true,

            summary: {

                total: result.length,

                healthy,

                warning,

                critical,

                averageLatency:
                    Number(
                        average(latency)
                            .toFixed(2)
                    ),

                averagePacketLoss:
                    Number(
                        average(packetLoss)
                            .toFixed(2)
                    ),

                averageThroughput:
                    Number(
                        average(throughput)
                            .toFixed(2)
                    )
            },

            topRouters,

            data: result
        });

    } catch (error) {

        console.error(
            "Analytics API Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message
        });
    }
});

module.exports = router;