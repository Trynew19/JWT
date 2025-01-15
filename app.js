const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const User = require("./models/index");
const jwt = require("jsonwebtoken");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/userDB", {    
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Not Connected to MongoDB ERROR! ", err);
});


// Middleware to verify JWT token
const authenticate = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send("Access Denied");
    }
  
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        return res.status(401).send("Invalid Token");
      }
      req.user = decoded;
      next();
    });
  };



// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
}); 

app.post("/register", async (req, res) => {
    
let user = req.body;

let newUser = new User(user);

let result = await newUser.save();

res.send(result);
});

app.post("/login", async (req, res) => {
    try {
      let user = req.body;
      let result = await User.find({ email: user.email, password: user.password });
  
      if (result.length === 0) {
        res.send("Invalid email or password");
      } else {
        console.log("Login successful");
  
        jwt.sign({ user }, "secret", { expiresIn: "1h" }, (err, token) => {
          if (err) {
            res.send(err);
          } else {
            res.json({ token });
          }
        });
      }
    } catch (err) {
      console.error(`Error: ${err}`);
      res.status(500).send("Error logging in");
    }
  });

app.get("/test", authenticate, (req, res) => {
    res.send("Hello World krishna chauhan ");
  });

//   app.post("/verify", (req, res) => {
//     const token = req.headers["authorization"];
//     if (!token) {
//       return res.status(401).send("Access Denied");
//     }
  
//     jwt.verify(token, "secret", (err, decoded) => {
//       if (err) {
//         return res.status(401).send("Invalid Token");
//       }
//       res.send(decoded);
//     });
//   });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

