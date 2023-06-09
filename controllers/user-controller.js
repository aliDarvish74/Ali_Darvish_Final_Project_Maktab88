const createError = require("http-errors");
const { unlink, access } = require("node:fs/promises");
const { join } = require("node:path");

const { ReadUserDto, UpdateUserDto } = require("../dto/user-dto");
const { ResponseDto } = require("../dto/response-dto");
const {
  createNewUser,
  deleteUserById,
  findAllUsers,
  normalizeAvatar,
} = require("../services/user-service");
const { multerUpload } = require("../utils/multer");
const {
  findAllUserArticles,
  deleteAllUserArticles,
} = require("../services/article-service");
const { deleteAllArticleComments } = require("../services/comment-service");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await findAllUsers(req.query);
    if (!users.length) {
      return next(createError(404, "Users not found."));
    }

    res.status(200).json(
      new ResponseDto(
        "success",
        "Users Found Successfully",
        users.map((user) => new ReadUserDto(user))
      )
    );
  } catch (error) {
    next(createError(500, "Internal server error"));
  }
};
const getUserById = async (req, res, next) => {
  res
    .status(200)
    .json(
      new ResponseDto(
        "success",
        "User found successfully",
        new ReadUserDto(res.locals.user)
      )
    );
};

const createUser = async (req, res, next) => {
  try {
    const result = await createNewUser(res.locals.user);
    req.session.userId = result._id;
    res
      .status(201)
      .json(
        new ResponseDto(
          "success",
          "User registered successfully",
          new ReadUserDto(result)
        )
      );
  } catch (error) {
    next(createError(500, "Create new User > " + error));
  }
};

const updateUser = async (req, res, next) => {
  try {
  const targetUser = res.locals.user;
  const updatedInfo = new UpdateUserDto(req.body);
  targetUser.firstname = updatedInfo.firstname ?? targetUser.firstname;
  targetUser.lastname = updatedInfo.lastname ?? targetUser.lastname;
  targetUser.username = updatedInfo.username ?? targetUser.username;
  targetUser.gender = updatedInfo.gender ?? targetUser.gender;
  targetUser.phoneNumber = updatedInfo.phoneNumber ?? targetUser.phoneNumber;
    const result = await targetUser.save();
    res
      .status(200)
      .json(
        new ResponseDto(
          "success",
          "User updated Successfully",
          new ReadUserDto(result)
        )
      );
  } catch (error) {
    next(createError(500, "Internal server error."));
  }
};

const changeUserPassword = async (req, res, next) => {
  const targetUser = res.locals.user;

  targetUser.password = req.body.newPassword;

  try {
    await targetUser.save();
    return res
      .status(200)
      .json(new ResponseDto("success", "Password updated successfully"));
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
};

const uploadUserAvatar = multerUpload.single("avatar");

const changeUserAvatar = async (req, res, next) => {
  try {
    const avatarFileName = await normalizeAvatar(req.file);
    const targetUser = res.locals.user;
    
    if (targetUser.avatar !== "user-default-avatar.png") {
      await unlink(
        join(__dirname, "..", "public", "images", "avatars", targetUser.avatar)
      );
    }
    targetUser.avatar = avatarFileName;
    await targetUser.save();
    res
      .status(200)
      .json(new ResponseDto("success", "Avatar updated successfully"));
  } catch (error) {
    next(createError(500, "Internal server error." + error.message));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    req.session.destroy();
    const userArticles = await findAllUserArticles(res.locals.user._id);
    for (const article of userArticles) {
      await deleteAllArticleComments(article._id);
    }
    await deleteAllUserArticles(res.locals.user._id);
    const result = await deleteUserById(res.locals.user._id);
    return res
      .status(204)
      .json(new ResponseDto("success", "User deleted Successfully", result));
  } catch (error) {
    return next(createError(500, "Internal server error."));
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  uploadUserAvatar,
  changeUserAvatar,
};
