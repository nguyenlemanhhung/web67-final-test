const env = require("dotenv");
env.config();
const express = require("express");
const app = express();
const { connectDb, client } = require("./connectdb");
const authentication = require("./authentication");

app.use(express.json());

connectDb().then(() => {
  console.log("done!!!");
});

// 1.get all products
app.get("/api/products", async (req, res) => {
  try {
    const result = await client
      .db("web67")
      .collection("inventory")
      .find()
      .toArray();
    if (result) {
      res.status(200).send(JSON.stringify(result));
    } else {
      res.status(404).send("product not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// 2.getting only products that have low quantity (less than 100)
app.get("/api/products/low-quantity", async (req, res) => {
  try {
    const result = await client
      .db("web67")
      .collection("inventory")
      .find({ instock: { $lt: 100 } })
      .toArray();
    if (result) {
      res.status(200).send(JSON.stringify(result));
    } else {
      res.status(404).send("product not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// 3.log-in

app.post("/login", authentication, async (req, res) => {
  try {
    const username = req.body.email;
    const password = req.body.password;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "email and password không được để trống" });
    }
    const checkExist = await client
      .db("web67")
      .collection("users")
      .findOne({ username: username });
    if (!checkExist) {
      return res.status(401).json({ message: "Tài khoản không tồn tại !!!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// 6.getting orders with the description
app.get("/order", async (req, res) => {
  try {
    const result = await client
      .db("web67")
      .collection("order")
      .find()
      .populate("item")
      .toArray();

    if (result) {
      res.status(200).send(JSON.stringify(result));
    } else {
      res.status(404).send("product not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
app.listen(process.env.PORT || 5000, () => {
  console.log(`listening on http://localhost/${process.env.PORT}`);
});
