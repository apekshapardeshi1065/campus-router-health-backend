// // const express = require("express");
// // const cors = require("cors");

// // const routerRoutes = require("./routes/routerRoutes");
// // const metricsRoutes = require("./routes/metricsRoutes");
// // const healthRoutes = require("./routes/healthRoutes");
// // const alertRoutes = require("./routes/alertRoutes");
// // const analyticsRoutes = require("./routes/analyticsRoutes");


// // const app = express();



// // app.use(cors());

// // app.use(express.json());


// // app.get("/", (req, res) => {

// //     res.json({

// //         success: true,

// //         message:
// //             "Campus Router Health 360 Backend is Running 🚀"

// //     });

// // });

// // app.get("/api/debug/metrics", async (req, res) => {

// //     try {

// //         const { readCSV } = require("./utils/csvReader");

// //         const metrics = await readCSV("metrics.csv");

// //         res.json({
// //             firstRow: metrics[0],
// //             columns: Object.keys(metrics[0] || {})
// //         });

// //     } catch (error) {

// //         res.status(500).json({
// //             error: error.message
// //         });

// //     }

// // });


// // app.use(
// //     "/api/routers",
// //     routerRoutes
// // );


// // app.use(
// //     "/api/metrics",
// //     metricsRoutes
// // );



// // app.use(
// //     "/api/health",
// //     healthRoutes
// // );


// // app.use(
// //     "/api/alerts",
// //     alertRoutes
// // );



// // app.use(
// //     "/api/analytics",
// //     analyticsRoutes
// // );



// // const PORT = 5000;

// // app.listen(PORT, () => {

// //     console.log(
// //         `Backend running on http://localhost:${PORT}`
// //     );

// // });



// const express = require("express");
// const cors = require("cors");

// const routerRoutes =
//     require("./routes/routerRoutes");

// const metricsRoutes =
//     require("./routes/metricsRoutes");


// const app = express();


// // ==========================================
// // MIDDLEWARE
// // ==========================================

// app.use(cors());

// app.use(express.json());


// // ==========================================
// // HOME
// // ==========================================

// app.get("/", (req, res) => {

//     res.json({

//         success: true,

//         message:
//             "Campus Router Health 360 Backend is Running 🚀"

//     });

// });


// // ==========================================
// // APIs
// // ==========================================

// app.use(
//     "/api/routers",
//     routerRoutes
// );

// app.use(
//     "/api/metrics",
//     metricsRoutes
// );


// // ==========================================
// // SERVER
// // ==========================================

// const PORT =
//     process.env.PORT || 5000;


// app.listen(
//     PORT,
//     "0.0.0.0",
//     () => {

//         console.log(
//             `Server running on port ${PORT}`
//         );

//     }
// );

const express = require("express");
const cors = require("cors");

const routerRoutes =
    require("./routes/routerRoutes");

const metricsRoutes =
    require("./routes/metricsRoutes");

const analyticsRoutes =
    require("./routes/analyticsRoutes");


const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "Campus Router Health 360 Backend is Running 🚀"

    });

});


// ==========================================
// APIs
// ==========================================

app.use(
    "/api/routers",
    routerRoutes
);

app.use(
    "/api/metrics",
    metricsRoutes
);

app.use(
    "/api/analytics",
    analyticsRoutes
);


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);