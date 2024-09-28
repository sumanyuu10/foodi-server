const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//middleware
app.use(cors());
app.use(express.json());

//mongo Db config

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@foodi-cluster.wsqbg1i.mongodb.net/demo-foodi-client?retryWrites=true&w=majority`,
    {
      family: 4,
    }
  )
  .then(console.log("MongoDB connected successfully"))
  .catch((error) =>
    console.log("error encountered while connecting MongoDB", error)
  );

//jwt authentication
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

//import routes here
const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoutes");
const adminStats = require("./api/routes/adminStats");
const orderStats = require("./api/routes/orderStats");
//routes
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);
app.use("/adminStats", adminStats);
app.use("/orderStats", orderStats);
//stripe payment
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency: "usd",
    description: "Software development services",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     await client.connect();

//     // databse and collections

//     const menuCollections = client.db("foodi-db").collection("menus");
//     const cartCollections = client.db("foodi-db").collection("cartItems");

//     //all menu item operations
//     app.get("/menu", async (req, res) => {
//       const result = await menuCollections.find().toArray();
//       res.send(result);
//     });

//     //all cart item operations

//     //posting cart to db
// app.post("/carts", async (req, res) => {
//   const cartItem = req.body;
//   const result = await cartCollections.insertOne(cartItem);
//   res.send(result);
// });

//     //get cart using email
//     app.get("/carts", async (req, res) => {
//       const email = req.query.email;
//       const filter = { email: email };
//       const result = await cartCollections.find(filter).toArray();
//       res.send(result);
//     });

//     //get spcific cart
//     app.get("/carts/:id", async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) };
//       const result = await cartCollections.findOne(filter);
//       res.send(result);
//     });

//     //delete cart using id
//     app.delete("/carts/:id", async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) };
//       const result = await cartCollections.deleteOne(filter);
//       res.send(result);
//     });

//     //update cart

//     app.put("/carts/:id", async (req, res) => {
//       const id = req.params.id;
//       const { quantity } = req.body;
//       const filter = { _id: new ObjectId(id) };
//       const options = { upsert: true };
//       const updateDoc = {
//         $set: {
//           quantity: parseInt(quantity, 10),
//         },
//       };
//       const result = await cartCollections.updateOne(
//         filter,
//         updateDoc,
//         options
//       );
//     });

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//   }
// }
// run().catch(console.dir);
