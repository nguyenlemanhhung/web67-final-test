const env = require("dotenv");
env.config();
const express = require("express");
const app = express();
const { connectDb, client } = require("./connectdb");
const authentication = require("./authentication");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
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
    checkExist.password = "";

    const accessToken = jwt.sign(
      {
        userId: checkExist._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    // console.log("accessToken:", accessToken);

    return res.status(200).json({
      user: checkExist,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// 5.Only logged-in user can visit it
app.get("/current", authentication, async (req, res) => {
  try {
    const userId = req.user;

    const user = await client.db("web67").collection("users").findById(userId);

    console.log("user: " + user);

    if (!user) {
      return res.json({ message: "Không có user" });
    }
    return res.json({
      user: user,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

// 6.getting orders with the description
app.get("/order", async (req, res) => {
  try {
    const result = await client
      .db("web67")
      .collection("order")
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

app.listen(process.env.PORT || 5000, () => {
  console.log(`listening on http://localhost/${process.env.PORT}`);
});
