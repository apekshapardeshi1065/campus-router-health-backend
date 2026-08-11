// const express = require("express");

// const { readCSV } = require("../utils/csvReader");

// const router = express.Router();



// router.get("/", async (req, res) => {

//     try {

//         const metrics = await readCSV("metrics.csv");

//         res.json({

//             success: true,

//             count: metrics.length,

//             data: metrics

//         });

//     } catch (error) {

//         console.error(error);

//         res.status(500).json({

//             success: false,

//             message: error.message

//         });

//     }

// });



// router.get("/:id", async (req, res) => {

//     try {

//         const metrics = await readCSV("metrics.csv");

//         const routerId = req.params.id;


//         const getId = (row) =>
//             row.router_id ??
//             row.routerId ??
//             row.Router_ID ??
//             row["Router ID"] ??
//             row.id ??
//             row.ID;


//         const routerMetrics = metrics.filter(
//             (item) =>
//                 String(getId(item)) ===
//                 String(routerId)
//         );


//         if (routerMetrics.length === 0) {

//             return res.status(404).json({

//                 success: false,

//                 message:
//                     `No metrics found for ${routerId}`

//             });

//         }


//         res.json({

//             success: true,

//             routerId: routerId,

//             count: routerMetrics.length,

//             data: routerMetrics

//         });


//     } catch (error) {

//         console.error(error);

//         res.status(500).json({

//             success: false,

//             message: error.message

//         });

//     }

// });


// module.exports = router;

const express = require("express");

const { readCSV } = require("../utils/csvReader");

const router = express.Router();


// ==========================================
// ALL METRICS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const metrics =
            await readCSV("metrics.csv");


        res.json({
            success: true,
            count: metrics.length,
            data: metrics
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

});


// ==========================================
// METRICS OF ONE ROUTER
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const metrics =
            await readCSV("metrics.csv");


        const routerId =
            req.params.id;


        const routerMetrics =
            metrics.filter(
                row =>
                    String(row.router_id)
                    === String(routerId)
            );


        if (routerMetrics.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    `No metrics found for ${routerId}`

            });

        }


        res.json({

            success: true,

            router_id: routerId,

            count: routerMetrics.length,

            data: routerMetrics

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