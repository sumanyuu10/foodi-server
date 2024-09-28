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
    const users = await User.countDocuments();
    const menus = await Menu.countDocuments();
    const orders = await Payment.countDocuments();

    const result = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$price",
          },
        },
      },
    ]);
    const revenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.status(200).json({
      users,
      orders,
      menus,
      revenue,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error " + error.message);
  }
});

module.exports = router;
