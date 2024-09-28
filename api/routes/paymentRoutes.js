const express = require("express");
const Payment = require("../models/Payments");
const router = express.Router();
const ObjectId = require("mongoose").Types.ObjectId;
const Cart = require("../models/Carts");
//verify token
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, async (req, res) => {
  const payment = req.body;
  try {
    const paymentRequest = await Payment.create(payment);

    //delete cartItems
    const cartIds = payment.cartItems.map((id) => new ObjectId(id));
    const deleteCartRequest = await Cart.deleteMany({ _id: { $in: cartIds } });
    res.status(200).json({ paymentRequest, deleteCartRequest });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  try {
    const decodedEmail = req.decoded.email;
    if (email !== decodedEmail) {
      res.status(403).json({ message: "You are not authorized" });
    }
    const result = await Payment.find(query).sort({ createdAt: -1 }).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//get all payments by a user

router.get("/all", async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 }).exec();
    res.status(200).json(payments);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//confirm payment status
router.patch("/:id", async (req, res) => {
  const payId = req.params.id;
  const { status } = req.body;
  try {
    const updateStatus = await Payment.findByIdAndUpdate(
      payId,
      {
        status: "confirmed",
      },
      { new: true, runValidators: true }
    );
    if (!updateStatus) {
      res.status(404).json({ message: "Payment not Found!" });
    }
    res.status(200).json(updateStatus);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
