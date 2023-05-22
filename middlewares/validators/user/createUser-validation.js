const Joi = require("joi");
const createError = require("http-errors");

const { CreateUserDto } = require("../../../dto/user-dto");
const {
  findUserByUsername,
  findUserByPhoneNumber,
} = require("../../../services/user-service");

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).*$/;
const phoneNumberRegex = /^(0|\+98)9\d{9}$/;

const createUserValidationSchema = Joi.object({
  firstname: Joi.string().required().trim().min(3).max(30),
  lastname: Joi.string().required().trim().min(3).max(30),
  username: Joi.string().required().trim().min(3).max(30),
  password: Joi.string().required().min(8).regex(passwordRegex),
  gender: Joi.string().valid("male", "female", "not-set").default("not-set"),
  phoneNumber: Joi.string().required().regex(phoneNumberRegex),
});

const createUserValidator = async (req, res, next) => {
  const newUserInfo = new CreateUserDto(req.body);
  const { error } = createUserValidationSchema.validate(newUserInfo, {
    abortEarly: false,
  });

  
  try {
    const duplicateUsername = await findUserByUsername(newUserInfo.username);
    if (!!duplicateUsername) {
      return next(
        createError(409, `${duplicateUsername.username} already taken before.`)
      );
    }

    const duplicatePhoneNumber = await findUserByPhoneNumber(
      req.body.phoneNumber
    );
    if (!!duplicatePhoneNumber) {
      return next(
        createError(
          409,
          `${duplicatePhoneNumber.phoneNumber} already taken before.`
        )
      );
    }
    res.locals.user = newUserInfo;
    next();
  } catch (error) {
    next(createError(500, "Internal Server Error"));
  }
};

module.exports = { createUserValidator };
