const express = require("express");
const router = express.Router();

//import modals
const User = require("../models/User");
const Payment = require("../models/Payments");
const Menu = require("../models/Menu");

//middlewares
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");

router.get("/", async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $unwind: "$menuItems",
      },
      {
        $lookup: {
          from: "menus",
          localField: "menuItems",
          foreignField: "_id",
          as: "menuItemDetails",
        },
      },
      {
        $unwind: "$menuItemDetails",
      },
      {
        $group: {
          _id: "$menuItemDetails.category",
          quantity: {
            $sum: "$quantity",
          },
          revenue: {
            $sum: "$price",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          quantity: "$quantity",
          revenue: "$revenue",
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Internal Error " + error.message);
  }
});

module.exports = router;
