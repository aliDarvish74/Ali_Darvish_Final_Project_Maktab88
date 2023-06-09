function CreateUserDto({
  firstname,
  lastname,
  username,
  password,
  gender = "not-set",
  phoneNumber,
}) {
  this.firstname = firstname;
  this.lastname = lastname;
  this.username = username;
  this.password = password;
  this.gender = gender;
  this.phoneNumber = phoneNumber;
}

function UpdateUserDto({
  firstname = null,
  lastname = null,
  username = null,
  gender = "not-set",
  phoneNumber,
}) {
  if (!!firstname) this.firstname = firstname;
  if (!!lastname) this.lastname = lastname;
  if (!!username) this.username = username;
  if (!!gender) this.gender = gender;
  if (!!phoneNumber) {
    this.phoneNumber = phoneNumber.map((phone) => {
      if (phone.startsWith("0")) {
        return `+98${phone.slice(1)}`;
      }
      return phone;
    });
  }
}

function UpdateUserPasswordDto({ currentPassword, newPassword }) {
  this.currentPassword = currentPassword;
  this.newPassword = newPassword;
}

function ReadUserDto({
  _id,
  firstname,
  lastname,
  username,
  gender = "not-set",
  phoneNumber,
  role = "blogger",
  avatar,
}) {
  this.userId = _id;
  this.firstname = firstname;
  this.lastname = lastname;
  this.username = username;
  this.gender = gender;
  this.phoneNumber = phoneNumber;
  this.role = role;
  this.avatar = avatar;
}

module.exports = {
  CreateUserDto,
  ReadUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
};
