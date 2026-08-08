

const express = require("express");
const { readCSV } = require("../utils/csvReader");

const router = express.Router();

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


router.get("/", async (req, res) => {
    try {
        const routers = await readCSV("routers.csv");

        res.json({
            success: true,
            count: routers.length,
            data: routers
        });

    } catch (error) {
        console.error("Router API Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});




router.get("/:id", async (req, res) => {
    try {
        const routers = await readCSV("routers.csv");

        const routerId = req.params.id;

        const routerData = routers.find(
            (item) =>
                String(getId(item)) === String(routerId)
        );

        if (!routerData) {
            return res.status(404).json({
                success: false,
                message: `Router ${routerId} not found`
            });
        }

        res.json({
            success: true,
            data: routerData
        });

    } catch (error) {
        console.error("Single Router Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;