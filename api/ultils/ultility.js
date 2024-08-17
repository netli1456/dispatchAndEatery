import { deviceCheck } from '../middleWareAuth/midleware.js';
import Device from '../models/deviceLog.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from './emailSmsHtml.js';
import ResetPassword from '../models/PasswordReset.js';
import User from '../models/userModel.js';

export const checkingLoggedInDevices = async ({
  user,
  fingerprints,
  req,
  creation,
  text,
  subject,
  warning,
  res,
}) => {
  const devices = deviceCheck(req);
  const loggedIndevices = await Device.findOne({
    userId: user._id.toString(),
  });

  if (loggedIndevices) {
    const existingDevice = loggedIndevices.devices.find(
      (device) => device.fingerprint === fingerprints
    );

    if (existingDevice) {
      if (existingDevice.ip === devices.ip && !existingDevice.otpIsVerified) {
        const otpverificationDevice = loggedIndevices.devices.find(
          (device) =>
            device.ip === devices.ip ||
            !device.otpIsVerified ||
            device.fingerprint === devices.fingerprint
        );
        ((otpverificationDevice.otp = !creation
          ? await sendVerificationEmail({ user, text, subject, warning, res })
          : creation),
        (otpverificationDevice.otpIsVerified = !creation ? false : true)),
          await loggedIndevices.save();
        return true;
      }

      if (existingDevice.ip !== devices.ip) {
        const newDevice = {
          fingerprint: fingerprints,
          device: devices.device,
          ip: devices.ip,
          location: devices.location,
          browser: devices.browser,
        };

        loggedIndevices.devices.push(newDevice);
        await loggedIndevices.save();
      }
    } else {
      loggedIndevices.devices.push({
        fingerprint: fingerprints,
        device: devices.device,
        ip: devices.ip,
        location: devices.location,
        browser: devices.browser,
        otp: await sendVerificationEmail({ user, text, subject, warning, res }),
      });

      await loggedIndevices.save();
      return true;
    }
  } else {
    const newDevice = new Device({
      userId: user._id,
      devices: {
        fingerprint: fingerprints,
        device: devices.device,
        ip: devices.ip,
        location: devices.location,
        browser: devices.browser,
        otp: !creation
          ? await sendVerificationEmail({ user, text, subject, warning })
          : creation,
        otpIsVerified: !creation ? false : true,
      },
    });

    await newDevice.save();
    return true;
  }
  return false;
};

export const sendToken = ({ user, res }) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
};

export const checkOtpexpiration = ({ user, otpCode, res }) => {
  if (!otpCode || user.otpIsVerified) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  const otpValid = bcrypt.compareSync(otpCode, user.otp);

  if (!otpValid) {
    return res.status(401).json({ message: 'Incorrect OTP' });
  }

  const otpAge = Date.now() - user.otpCreatedAt.getTime();
  const otpExpiry = 100 * 60 * 1000;

  if (otpAge > otpExpiry) {
    return res.status(403).json({ message: 'OTP has expired' });
  }

  user.otpIsVerified = true;
  user.otp = !user.fingerprint ? undefined : user.otp;
  user.otpCreatedAt = !user.fingerprint ? undefined : user.otpCreatedAt;
};

export const checkIfCurrentDeviceMatchAnyInDb = ({ newloginDetails, req }) => {
  const tryingToLogIndevice = deviceCheck(req);

  const fingerprint = req.body.fingerprint
    ? req.body.fingerprint
    : req.params.fingerprint;
  const verifyDevice = newloginDetails.devices.find(
    (device) =>
      device.fingerprint === fingerprint &&
      device.ip === tryingToLogIndevice.ip &&
      device.browser === tryingToLogIndevice.browser &&
      device.location === tryingToLogIndevice.location
  );
  return verifyDevice;
};

export const findDeviceByUserId = async ({ req, user, res }) => {
  const newLoginUser = await User.findOne({ email: req.body.email });
  if (!newLoginUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const sentResetOtp = await ResetPassword.findOne({
    userId: newLoginUser._id.toString(),
    fingerprint: req.body.fingerprint,
  });
  if (!sentResetOtp) {
    return res.status(401).json({ message: 'expired' });
  }

  const otpExpireResult = checkOtpexpiration({
    otpCode: req.body.otpCode,
    user: sentResetOtp,
    fingerprint: req.body.fingerprint,
    res,
  });
  if (otpExpireResult) {
    return;
  }

  const newloginDetails = await Device.findOne({
    userId: newLoginUser._id.toString(),
  });

  if (!newloginDetails) {
    const creation = `password reset login on the ${Date.now()}`;
    await checkingLoggedInDevices({
      user: newLoginUser,
      fingerprints: req.body.fingerprint,
      req,
      creation,
      res,
    });
  }
  await sentResetOtp.save();

  return newLoginUser;
};
