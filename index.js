const express = require("express");
const fs = require("fs");
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
const uri = process.env.MONGODB;
app.get("/", function(req, res) {
  res.render("Main", {});
});
app.post("/", (req, res) => {
  var cookieToken = req.cookies.idToken;
  console.log(cookieToken);
  if (req.body.idtoken && req.body.profilePic && req.body.username) {
    console.log("User Signed In!")
    console.log(`ID_TOKEN Recieved: ${req.body.idtoken}`);
    console.log(`User_Name Recieved: ${req.body.username}`);
    console.log(`Profile_Pic Recieved: ${req.body.profilePic}`);
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      collection2 = client.db("Nodeflow").collection("UserData");
      console.log("Inserting User Data...")
      collection2.find({ Username: req.body.username }).toArray(function(err, checkVal) {
        if (err) throw err;
        collection2.insertOne({ un: req.body.username, imur: req.body.profilePic, Id_Token: req.body.idtoken, }, (err, result) => {
          if (err) throw err;
          console.log("Inserted User Data!");
          client.close();
        });
      });
    });
    /*
      To access the Token: req.body.idtoken
      To access the Username: req.body.username
      To access the Picture: req.body.profilePic
    */
  };
});
app.get("/Flow", (req, res) => {
  var check = req.headers.cookie.split("; ")[2];
  if (check) {
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      collection = client.db("Nodeflow").collection("Posts");
      console.log("Querying...");
      collection.find().sort({ _id: -1 }).toArray(function(err, result) {
        if (err) throw err;
        MongoClient.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }, (err, client) => {
          if (err) {
            console.error(err)
            return
          }
          collection2 = client.db("Nodeflow").collection("UserData");
          console.log("Inserting...");
          collection2.find({ Id_Token: req.cookies.idToken }).limit(1).sort({ _id: -1 }).toArray(function(err, otherRes) {
            if (err) throw err;
            console.log(otherRes)
            res.render('Flow', {
              "blogs": result,
              "data": otherRes
            });
          });
        });
      });
    });
  } else {
    res.render("404");
  }
});
app.post("/Flow", (req, res) => {
  MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    collection = client.db("Nodeflow").collection("Posts");
    console.log("Querying...")
    collection.insertOne({ title: req.body.title, date: req.body.date, name: req.body.name, blog: req.body.blog, }, (err, result) => {
      if (err) throw err;
      console.log("Posted!");
      res.render('Main');
      client.close();
    });
  });
});
app.get("/Create", (req, res) => {
  var check = req.headers.cookie.split("; ")[2];
  if (check) {
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      collection2 = client.db("Nodeflow").collection("UserData");
      console.log("Inserting...");
      collection2.find({ Id_Token: req.cookies.idToken }).limit(1).sort({ _id: -1 }).toArray(function(err, otherRes) {
        if (err) throw err;
        res.render('Create', {
          "data": otherRes
        });
      });
    });
  } else {
    res.render("404");
  };
});
app.get("/Search", (req, res) => {
  var check = req.headers.cookie.split("; ")[2];
  if (check) {
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      }
      collection = client.db("Nodeflow").collection("SearchQuery");
      console.log("Finding...");
      collection.find().sort({ _id: -1 }).limit(1).toArray(function(err, query) {
        if (err) throw err;
        console.log(query);
        MongoClient.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }, (err, client) => {
          if (err) {
            console.error(err)
            return;
          }
          newCollection = client.db("Nodeflow").collection("Posts");
          console.log("Matching...");
          var querys = fs.readFileSync("Query.txt", { encoding: "utf8" });
          newCollection.find({ title: querys }).toArray(function(err, result) {
            if (err) throw err;
            console.log(query);
            console.log(querys);
            console.log(result);
            if (err) throw err;
            res.render('Search', {
              "blogs": result,
              "searched": query
            });
          });
        });
      });
    });
  } else {
    res.render("404");
  };
});
app.post("/Search", (req, res) => {
  var query = req.body.query;
  console.log("Searched:", query);
  MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    collection = client.db("Nodeflow").collection("SearchQuery");
    console.log("Inserting...");
    collection.insertOne({ query: req.body.query, }, (err, result) => {
      if (err) throw err;
      console.log("Inserted!");
      client.close();
      fs.writeFile("Query.txt", req.body.query, () => { });
    });
  });
});
app.get("/Post", function(req, res) {
  var check = req.headers.cookie.split("; ")[2];
  if (check) {
    var Post = fs.readFileSync("Post.txt", { encoding: "utf8" });
    MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      if (err) {
        console.error(err)
        return
      };
      collection = client.db("Nodeflow").collection("Posts");
      console.log("Getting Post...");
      collection.find({ title: Post }).sort({ _id: -1 }).toArray(function(err, result) {
        if (err) throw err;
        res.render('Post', {
          "blogs": result
        });
      });
    });
  } else {
    res.render("404");
  };
});
app.post("/Post", function(req, res) {
  if (req.body.resp) {
    console.log("Response: " + req.body.resp);
  } else {
    console.log("Post: " + req.body.getloc);
    fs.writeFile("Post.txt", req.body.getloc, () => { });
  };
});
app.get("*", function(req, res) {
  res.status(404).render("404");
});
app.listen(8080, () => {
  console.log("Server Started on port %d", 8080);
});
// Add a respond button