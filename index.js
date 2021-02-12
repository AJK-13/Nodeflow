const express = require("express");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const fetch = require("node-fetch");
const bp = require("body-parser");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cookieParser());
const uri = `mongodb+srv://Ajk:${process.env.TOKEN}@nodeflow.1ujtn.mongodb.net/Nodeflow?retryWrites=true&w=majority`;
app.get("/", function(req, res) {
  res.render("Main", {});
});
app.post("/", (req, res) => {
  if (req.body.idtoken && req.body.profilePic && req.body.username) {
    console.log(`ID_TOKEN Recieved: ${req.body.idtoken}`);
    console.log(`User_Name Recieved: ${req.body.username}`);
    console.log(`Profile_Pic Recieved: ${req.body.profilePic}`);
    MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      console.error(err)
      return;
    }
    collection = client.db("Nodeflow").collection("UserInfo");
    /*Check Who The User Is And If They're User Data Is Already Stored In MongoDB. If They're Info Is Stored In Mongo, Don't Send The Data. If They're Info Isn't Stored Store It.*/
    });
  };
  if (req.body.isSigningOut) {
    console.log("User Signed Out");
    res.clearCookie("ID_TOKEN", {
      expires: new Date(Date.now() + 1000 * 60 * 599999),
      httpOnly: true,
    });
    res.end();
    return;
  } else {
    res.cookie("ID_TOKEN", req.body.idtoken, {
      expires: new Date(Date.now() + 1000 * 60 * 599999),
      httpOnly: true,
    });
  };
  /* 
    To access the Token: req.body.idtoken
    To access the Username: req.body.username
    To access the Picture: req.body.profilePic
  */
});
app.get("/Flow", (req, res) => {
  res.render("Flow", {});
});
app.get("*", function(req, res) {
  res.status(404).render("404");
});
app.listen(8080, () => {
  console.log("Server Started on port %d", 8080);
});