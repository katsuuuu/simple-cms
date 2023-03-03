const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const { info } = require("console");

const salt = bcrypt.genSaltSync(10);
const secret = "fb27cgdwe78g758dewdewfrevcfr32f";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
// app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  "mongodb+srv://nakanishikatsu0804:386RsbGTlJ987u5i@cluster0.on9zjah.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    // logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("ログイン失敗");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

// app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
//   const { originalname, path } = req.file;
//   const parts = originalname.split(".");
//   const ext = parts[parts.length - 1];
//   const newPath = path + "." + ext;
//   fs.renameSync(path, newPath);

//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;
//     const { title, summary, content } = req.body;
//     const postDoc = await Post.create({
//       title,
//       summary,
//       content,
//       cover: newPath,
//       author: info.id,
//     });
//     res.json(postDoc);
//   });
// });

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  // const { originalname, path } = req.file;
  // const parts = originalname.split(".");
  // const ext = parts[parts.length - 1];
  // const newPath = path + "." + ext;
  // fs.renameSync(path, newPath);

  // Numberだと0に置き換える
  if (
    typeof req.body.title === "string" &&
    req.body.title.toLowerCase() === "number"
  ) {
    req.body.title = 0;
  }
  // Numberだと0に置き換える
  if (
    typeof req.body.summary === "string" &&
    req.body.summary.toLowerCase() === "number"
  ) {
    req.body.summary = 0;
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      author: info.id,
    });
    res.json(postDoc);
  });
});

// app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
//   let newPath = null;
//   if (req.file) {
//     const { originalname, path } = req.file;
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     newPath = path + "." + ext;
//     fs.renameSync(path, newPath);
//   }

//   const { token } = req.cookies;
//   jwt.verify(token, secret, {}, async (err, info) => {
//     if (err) throw err;
//     const { id, title, summary, content } = req.body;
//     const postDoc = await Post.findById(id);
//     const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//     if (!isAuthor) {
//       return res.status(400).json("you are not the author");
//     }
//     await postDoc.update({
//       title,
//       summary,
//       content,
//       cover: newPath ? newPath : postDoc.cover,
//     });

//     res.json(postDoc);
//   });
// });

// Edit
app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    // データの型をチェックして、変更できない場合はエラーを返す
    // if (title === "Text" && typeof postDoc.title === "number") {
    //   return res.status(400).json("Cannot change String to Number");
    // }
    // if (summary === "Text" && typeof postDoc.summary === "number") {
    //   return res.status(400).json("Cannot change String to Number");
    // }
    // if (typeof title === 0 && postDoc.title === "Text") {
    //   return res.status(400).json("Cannot change String to Number");
    // }
    // if (typeof summary === 0 && postDoc.summary === "Text") {
    //   return res.status(400).json("Cannot change String to Number");
    // }
    await postDoc.update({
      title,
      summary,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.listen(4000);

// Password for nakanishikatsu0804
// 386RsbGTlJ987u5i
// Mongo connection
// mongodb+srv://nakanishikatsu0804:386RsbGTlJ987u5i@cluster0.on9zjah.mongodb.net/?retryWrites=true&w=majority

// summaryの型を見る // typeof()
