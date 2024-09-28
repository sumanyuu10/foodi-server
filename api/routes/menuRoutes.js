const express = require("express");
const Menu = require("../models/Menu");
const menuControllers = require("../controllers/menuControllers");
const router = express.Router();

// get all menu items from db

router.get("/", menuControllers.getAllMenuItems);

// post a menu item
router.post("/", menuControllers.postMenuItem);

// delete a menu item
router.delete("/:id", menuControllers.deleteMenuItem);

// get single menu item
router.get("/:id", menuControllers.singleMenuItem);

// update single menu item
router.patch("/:id", menuControllers.updateMenuItem);

module.exports = router;
