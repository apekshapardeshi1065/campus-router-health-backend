function generateRecommendation(metrics) {

    const latency = Number(
        metrics.latency ||
        metrics.Latency ||
        0
    );

    const packetLoss = Number(
        metrics.packet_loss ||
        metrics.packetLoss ||
        metrics["Packet Loss"] ||
        0
    );

    const throughput = Number(
        metrics.throughput ||
        metrics.Throughput ||
        0
    );


    const recommendations = [];


    if (latency > 100) {
        recommendations.push(
            "High latency detected. Inspect router connectivity and network congestion."
        );
    } else if (latency > 50) {
        recommendations.push(
            "Latency is elevated. Check network traffic and router load."
        );
    }


    if (packetLoss > 5) {
        recommendations.push(
            "High packet loss detected. Check cable connections and router interface."
        );
    } else if (packetLoss > 2) {
        recommendations.push(
            "Packet loss is above normal. Inspect connectivity and interference."
        );
    }


    if (throughput < 10) {
        recommendations.push(
            "Very low throughput detected. Check bandwidth utilization and congestion."
        );
    } else if (throughput < 50) {
        recommendations.push(
            "Throughput is below optimal level. Check network load."
        );
    }


    if (recommendations.length === 0) {

        recommendations.push(
            "Router is performing normally. No immediate action required."
        );

    }


    return recommendations;
}


module.exports = {
    generateRecommendation
};