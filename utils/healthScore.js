

function getNumber(value) {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

function calculateHealthScore(metric = {}) {

  // Different possible CSV column names
  const latency = getNumber(
    metric.latency ??
    metric.Latency ??
    metric.latency_ms ??
    metric.Latency_ms
  );

  const packetLoss = getNumber(
    metric.packet_loss ??
    metric.packetLoss ??
    metric.packet_loss_percent ??
    metric.Packet_Loss ??
    metric.packetLossPercent
  );

  const throughput = getNumber(
    metric.throughput ??
    metric.Throughput ??
    metric.throughput_mbps ??
    metric.Throughput_Mbps
  );

  /*
    HEALTH SCORE

    Latency:
    <= 20ms  = excellent
    <= 50ms  = good
    <= 100ms = average
    > 100ms  = poor

    Packet Loss:
    <= 1% = excellent
    <= 3% = good
    <= 5% = average
    > 5% = poor

    Throughput:
    >= 100 Mbps = excellent
    >= 50 Mbps  = good
    >= 20 Mbps  = average
    < 20 Mbps   = poor
  */

  let latencyScore;

  if (latency <= 20) {
    latencyScore = 100;
  } else if (latency <= 50) {
    latencyScore = 85;
  } else if (latency <= 100) {
    latencyScore = 65;
  } else {
    latencyScore = 35;
  }


  let packetLossScore;

  if (packetLoss <= 1) {
    packetLossScore = 100;
  } else if (packetLoss <= 3) {
    packetLossScore = 85;
  } else if (packetLoss <= 5) {
    packetLossScore = 65;
  } else {
    packetLossScore = 35;
  }


  let throughputScore;

  if (throughput >= 100) {
    throughputScore = 100;
  } else if (throughput >= 50) {
    throughputScore = 85;
  } else if (throughput >= 20) {
    throughputScore = 65;
  } else {
    throughputScore = 35;
  }


  // Weighted final score
  const score =
    latencyScore * 0.35 +
    packetLossScore * 0.35 +
    throughputScore * 0.30;


  return Math.round(score);
}


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