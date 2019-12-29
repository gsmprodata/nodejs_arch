require("dotenv").config({ path: "../.env" });
require("babel-polyfill");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");

/**
 *  Authentication Service
 */

const authenticate = async ({
  email,
  password,
  isSocialLogin,
  socialProvider,
  socialId
}) => {
  const user = await User.findOne({ email });
  if (user && user.isDeactivated == false) {
    if (isSocialLogin == false && bcrypt.compareSync(password, user.password)) {
      const {
        hash,
        password,
        __v,
        ...userWithoutHashAndPassword
      } = user.toObject();
      const token = jwt.sign({ sub: user._id }, process.env.USER_AUTH_SECRET, {
        expiresIn: "12h",
        algorithm: "HS512"
      });
      return {
        ...userWithoutHashAndPassword,
        token
      };
    }
    if (isSocialLogin) {
      if (socialId === user[socialProvider + "Id"]) {
        const {
          hash,
          password,
          __v,
          ...userWithoutHashAndPassword
        } = user.toObject();
        const token = jwt.sign(
          { sub: user._id },
          process.env.USER_AUTH_SECRET,
          {
            expiresIn: "12h",
            algorithm: "HS512"
          }
        );
        return {
          token,
          ...userWithoutHashAndPassword
        };
      }
    }
  }
};

/**
 *  User Model CRUD Services
 */

const getAll = async () => {
  return await User.find().select("-password -createdAt -updatedAt -id -__v");
};

const getById = async id => {
  return await User.findById(id).select(
    "-password -createdAt -updatedAt -id -__v"
  );
};

const create = async user => {
  if (await User.findOne({ email: user.email })) {
    throw "email " + user.email + " is already taken";
  }
  let inviteCode = crypto
    .createHmac("sha256", process.env.USER_AUTH_SECRET)
    .update(
      JSON.stringify({
        email: user.inviter,
        invitee: user.email
      })
    )
    .digest("hex");
  inviteCode = inviteCode.substr(inviteCode.length - 6).toUpperCase();
  if (user.regCode !== inviteCode) throw "RegCodeMismatch";
  const newUser = new User(user);
  if (newUser.password) {
    newUser.password = bcrypt.hashSync(newUser.password, 10);
  }
  if (!newUser.emailIsVerified) {
    const emailToken = crypto
      .createHmac("sha256", process.env.USER_AUTH_SECRET)
      .update(
        JSON.stringify({ email: newUser.email, password: newUser.password })
      )
      .digest("hex");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SRVR,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mail = await transporter.sendMail({
      to: `"${newUser.name}" <${newUser.email}>`, // sender address
      from: process.env.SMTP_USER, // list of receivers
      subject: "StreetHack: Verify your e-mail address", // Subject line
      text: `Click on ${process.env.APP_URL}/api/users/verifyEmail?email=${
        newUser.email
        }&emailToken=${emailToken} to verify your e-mail address.` // plain text body
    });
  }
  await newUser.save();
};

const update = async (id, userParam) => {
  const user = await User.findById(id);
  if (
    user.email !== userParam.email &&
    (await User.findOne({ email: userParam.email }))
  ) {
    throw "email " + userParam.email + " is already taken";
  }
  if (userParam.password) {
    userParam.password = bcrypt.hashSync(userParam.password, 10);
  }
  Object.assign(user, userParam);
  await user.save();
  const token = jwt.sign({ sub: user._id }, process.env.USER_AUTH_SECRET, {
    expiresIn: "12h",
    algorithm: "HS512"
  });
  delete user.password;
  return {
    user: user,
    token
  };
};

const _delete = async id => {
  await User.findByIdAndRemove(id);
};

const _deactivate = async id => {
  await User.findByIdAndUpdate(id, { isDeactivated: true });
};

/**
 *  Mail Services
 */
const sendResetPasswordEmail = async email => {
  const user = await User.findOne({ email });
  if (user) {
    const emailToken = crypto
      .createHmac("sha256", process.env.USER_AUTH_SECRET)
      .update(
        JSON.stringify({
          email: user.email,
          _id: user._id
        })
      )
      .digest("hex");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SRVR,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mail = await transporter.sendMail({
      to: `"${user.name}" <${user.email}>`, // sender address
      from: process.env.SMTP_USER, // list of receivers
      subject: "StreetHack: Password Reset Link", // Subject line
      text: `Click on ${process.env.APP_URL}/api/users/resetPassword?email=${
        user.email
        }&emailToken=${emailToken} to reset your password.` // plain text body
    });
  } else {
    throw "user not found";
  }
};

const verifyResetPasswordEmail = async ({ email, emailToken }) => {
  const user = await User.findOne({ email });
  if (
    user &&
    emailToken ==
    crypto
      .createHmac("sha256", process.env.USER_AUTH_SECRET)
      .update(
        JSON.stringify({
          email: user.email,
          _id: user._id
        })
      )
      .digest("hex")
  ) {
    const token = jwt.sign({ sub: user._id }, process.env.USER_AUTH_SECRET, {
      expiresIn: "12h",
      algorithm: "HS512"
    });
    return {
      id: user._id,
      token
    };
  }
};

const verifyEmail = async (email, token) => {
  const user = await User.findOne({ email });
  if (!user) throw "user not found";
  if (
    user &&
    token !=
    crypto
      .createHmac("sha256", process.env.USER_AUTH_SECRET)
      .update(JSON.stringify({ email: user.email, password: user.password }))
      .digest("hex")
  )
    throw "token not matched";
  if (
    user &&
    token ==
    crypto
      .createHmac("sha256", process.env.USER_AUTH_SECRET)
      .update(JSON.stringify({ email: user.email, password: user.password }))
      .digest("hex")
  ) {
    user.emailIsVerified = true;
    await user.save();
  }
};

const sendInviteEmail = async ({ existentUser, email }) => {
  const user = await User.findOne({ email: existentUser });
  if (user) {
    let emailToken = crypto
      .createHmac("sha256", process.env.USER_AUTH_SECRET)
      .update(
        JSON.stringify({
          email: user.email,
          invitee: email
        })
      )
      .digest("hex");

    emailToken = emailToken.substr(emailToken.length - 6).toUpperCase();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SRVR,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mail = await transporter.sendMail({
      to: `${email}`, // sender address
      from: process.env.SMTP_USER, // list of receivers
      subject: `${user.name} invited you to StreetHack`, // Subject line
      html: `Invited by: ${existentUser}<br />Unique Invitation Code: ${emailToken}` // plain text body
    });
  } else {
    throw "user not found";
  }
};

const requestInviteEmail = async ({ email, name, institution, motivation }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SRVR,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mail = await transporter.sendMail({
    to: "info@streethack.org", // sender address
    from: process.env.SMTP_USER, // list of receivers
    subject: `${name} requested an invite`, // Subject line
    html: `New Request to Join StreetHack<hr /><br />Email: ${email}<br />Name: ${name}<br />Insitution: ${institution}<br />Motivation: ${motivation}` // plain text body
  });
};

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  verifyEmail,
  sendResetPasswordEmail,
  verifyResetPasswordEmail,
  requestInviteEmail,
  sendInviteEmail,
  update,
  delete: _delete,
  deactivate: _deactivate
};
