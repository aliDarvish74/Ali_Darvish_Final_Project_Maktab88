const express = require("express");

const { createUser } = require("../controllers/user-controller");
const { userSignIn, userSignOut } = require("../controllers/auth-controller");
const {
  createUserValidator,
} = require("../middlewares/validators/user/createUser-validation");
const {
  userSignInValidator,
} = require("../middlewares/validators/auth/signin-validation");

const router = express.Router();

router.post("/register", createUserValidator, createUser);
router.post("/signin", userSignInValidator, userSignIn);
router.get("/signout", userSignOut);

module.exports = router;
