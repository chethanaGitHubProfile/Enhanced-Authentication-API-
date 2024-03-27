require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { checkSchema } = require("express-validator");
const configureDB = require("./app/config/db");
const roles = require("./app/utils/roles");

const app = express();

//multer package is used to upload photo
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  //defines destination directory where uploaded file to be stored
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    return cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
app.set("view engine", "ejs");

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post(
  "/upload",
  (req, res, next) => {
    upload.single("images")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(400).send("Multer error occured");
      } else if (err) {
        res.status(500).send("an unknow error occured");
      } else {
        next();
      }
    });
  },
  (req, res) => {
    console.log(req.file);
    res.send("image uploaded");
  }
);

//Login via Google
app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/login", (req, res) => {
  res.render("login");
});

//Controllers
const userCtrl = require("./app/controllers/user-Ctrl");
const { authenticateUser, authorizeUser } = require("./app/middleware/auth");
const {
  userRegisterationSchema,
  userLoginSchema,
} = require("./app/validations/user-validation");
const passport = require("passport");

app.use(express.json());
app.use(cors());

//Register API
app.post(
  "/api/user/register",
  checkSchema(userRegisterationSchema),
  upload.single("images"),
  userCtrl.register
);

//Login API
app.post("/api/users/login", checkSchema(userLoginSchema), userCtrl.Login);

//Account API
app.get("/api/users/account", authenticateUser, userCtrl.account);

//API - for admin users to view both public and private user profiles
app.get(
  "/api/users/allUsers",
  authenticateUser,
  authorizeUser([roles.admin]),
  userCtrl.allUsers
);

// API - for normal users can only access public profiles
app.get("/api/users/publicProfile", userCtrl.publicProfile);

//API - As a user i can see my profile
app.get("/api/user/viewProfile/:id", authenticateUser, userCtrl.viewProfile);

//User cann edit their profile
app.put(
  "/api/user/edit/:id",
  authenticateUser,
  checkSchema(userRegisterationSchema),
  userCtrl.editProfile
);

//API for signout
app.post("/api/users/signout", authenticateUser, userCtrl.signout);
const port = 3060;

app.get(
  "/api/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
configureDB();
app.listen(port, () => {
  console.log("User collection is running successfully on port", port);
});
