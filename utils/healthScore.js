

// function getNumber(value) {
//   const n = parseFloat(value);
//   return Number.isNaN(n) ? 0 : n;
// }

// function calculateHealthScore(metric = {}) {

//   // Different possible CSV column names
//   const latency = getNumber(
//     metric.latency ??
//     metric.Latency ??
//     metric.latency_ms ??
//     metric.Latency_ms
//   );

//   const packetLoss = getNumber(
//     metric.packet_loss ??
//     metric.packetLoss ??
//     metric.packet_loss_percent ??
//     metric.Packet_Loss ??
//     metric.packetLossPercent
//   );

//   const throughput = getNumber(
//     metric.throughput ??
//     metric.Throughput ??
//     metric.throughput_mbps ??
//     metric.Throughput_Mbps
//   );

//   /*
//     HEALTH SCORE

//     Latency:
//     <= 20ms  = excellent
//     <= 50ms  = good
//     <= 100ms = average
//     > 100ms  = poor

//     Packet Loss:
//     <= 1% = excellent
//     <= 3% = good
//     <= 5% = average
//     > 5% = poor

//     Throughput:
//     >= 100 Mbps = excellent
//     >= 50 Mbps  = good
//     >= 20 Mbps  = average
//     < 20 Mbps   = poor
//   */

//   let latencyScore;

//   if (latency <= 20) {
//     latencyScore = 100;
//   } else if (latency <= 50) {
//     latencyScore = 85;
//   } else if (latency <= 100) {
//     latencyScore = 65;
//   } else {
//     latencyScore = 35;
//   }


//   let packetLossScore;

//   if (packetLoss <= 1) {
//     packetLossScore = 100;
//   } else if (packetLoss <= 3) {
//     packetLossScore = 85;
//   } else if (packetLoss <= 5) {
//     packetLossScore = 65;
//   } else {
//     packetLossScore = 35;
//   }


//   let throughputScore;

//   if (throughput >= 100) {
//     throughputScore = 100;
//   } else if (throughput >= 50) {
//     throughputScore = 85;
//   } else if (throughput >= 20) {
//     throughputScore = 65;
//   } else {
//     throughputScore = 35;
//   }


//   // Weighted final score
//   const score =
//     latencyScore * 0.35 +
//     packetLossScore * 0.35 +
//     throughputScore * 0.30;


//   return Math.round(score);
// }


// function getHealthStatus(score) {

//   if (score >= 75) {
//     return "Healthy";
//   }

//   if (score >= 50) {
//     return "Warning";
//   }

//   return "Critical";
// }


// module.exports = {
//   calculateHealthScore,
//   getHealthStatus
// };


// ==========================================
// HEALTH SCORE CALCULATION
// ==========================================

function getNumber(row, keys, defaultValue = 0) {
    for (const key of keys) {
        if (
            row[key] !== undefined &&
            row[key] !== null &&
            row[key] !== ""
        ) {
            const value = parseFloat(row[key]);

            if (!Number.isNaN(value)) {
                return value;
            }
        }
    }

    return defaultValue;
}


// ==========================================
// CALCULATE HEALTH SCORE
// ==========================================

function calculateHealthScore(metrics = {}) {

    // Get values from different possible CSV column names

    const latency = getNumber(metrics, [
        "latency",
        "Latency",
        "latency_ms",
        "Latency_ms",
        "latencyMs",
        "ping",
        "Ping"
    ], 20);


    const packetLoss = getNumber(metrics, [
        "packet_loss",
        "packetLoss",
        "Packet_Loss",
        "packet_loss_percent",
        "packetLossPercent",
        "Packet Loss",
        "loss"
    ], 0);


    const throughput = getNumber(metrics, [
        "throughput",
        "Throughput",
        "throughput_mbps",
        "throughputMbps",
        "Throughput_Mbps"
    ], 50);


    // ------------------------------------------
    // LATENCY SCORE
    // Lower latency = better
    // ------------------------------------------

    let latencyScore;

    if (latency <= 20) {
        latencyScore = 100;
    } else if (latency <= 40) {
        latencyScore = 90;
    } else if (latency <= 60) {
        latencyScore = 75;
    } else if (latency <= 100) {
        latencyScore = 55;
    } else if (latency <= 150) {
        latencyScore = 35;
    } else {
        latencyScore = 15;
    }


    // ------------------------------------------
    // PACKET LOSS SCORE
    // Lower packet loss = better
    // ------------------------------------------

    let packetLossScore;

    if (packetLoss <= 0.5) {
        packetLossScore = 100;
    } else if (packetLoss <= 1) {
        packetLossScore = 90;
    } else if (packetLoss <= 3) {
        packetLossScore = 75;
    } else if (packetLoss <= 5) {
        packetLossScore = 55;
    } else if (packetLoss <= 10) {
        packetLossScore = 35;
    } else {
        packetLossScore = 15;
    }


    // ------------------------------------------
    // THROUGHPUT SCORE
    // Higher throughput = better
    // ------------------------------------------

    let throughputScore;

    if (throughput >= 100) {
        throughputScore = 100;
    } else if (throughput >= 75) {
        throughputScore = 90;
    } else if (throughput >= 50) {
        throughputScore = 75;
    } else if (throughput >= 25) {
        throughputScore = 55;
    } else if (throughput > 0) {
        throughputScore = 35;
    } else {
        throughputScore = 50;
    }


    // ------------------------------------------
    // FINAL SCORE
    // ------------------------------------------

    const score =
        latencyScore * 0.30 +
        packetLossScore * 0.35 +
        throughputScore * 0.35;


    return Math.round(
        Math.max(0, Math.min(100, score))
    );
}


// ==========================================
// HEALTH STATUS
// ==========================================

function getHealthStatus(score) {

    if (score >= 75) {
        return "Healthy";
    }

    if (score >= 50) {
        return "Warning";
    }

    return "Critical";
}


module.exports = {
    calculateHealthScore,
    getHealthStatus
};