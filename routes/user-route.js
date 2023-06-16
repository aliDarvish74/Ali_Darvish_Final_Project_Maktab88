const express = require("express");

const {
  updateUser,
  deleteUser,
  changeUserPassword,
  getAllUsers,
  getUserById,
  changeUserAvatar,
  uploadUserAvatar,
} = require("../controllers/user-controller");
const {
  updateUserValidator,
} = require("../middlewares/validators/user/updateUser-validator");
const {
  existUserValidator,
} = require("../middlewares/validators/user/existUser-validation");
const {
  updateUserPasswordValidator,
} = require("../middlewares/validators/user/updateUserPassword-validation");
const {
  isSignedIn,
} = require("../middlewares/validators/auth/isSignedIn-validation");

const router = express.Router();
router.get("/", getAllUsers);
router.get("/:id", existUserValidator, getUserById);
router.patch(
  "/:id",
  isSignedIn,
  existUserValidator,
  updateUserValidator,
  updateUser
);
router.delete("/:id", existUserValidator, deleteUser);

router.patch(
  "/password/:id",
  isSignedIn,
  existUserValidator,
  updateUserPasswordValidator,
  changeUserPassword
);
router.post(
  "/avatar/:id",
  isSignedIn,
  existUserValidator,
  uploadUserAvatar,
  changeUserAvatar
);

module.exports = router;
