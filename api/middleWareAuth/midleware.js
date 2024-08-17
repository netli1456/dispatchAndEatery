import jwt from 'jsonwebtoken';
import geoip from 'geoip-lite';
import DeviceDetector from 'device-detector-js';
import Device from '../models/deviceLog.js';
import { checkIfCurrentDeviceMatchAnyInDb } from '../ultils/ultility.js';
import User from '../models/userModel.js';

export const deviceCheck = (req) => {
  const detector = new DeviceDetector();
  const userAgent = req.headers['user-agent'];
  const deviceInfo = detector.parse(userAgent);

  let deviceType = 'Unknown';
  let os = 'Unknown';
  let browser = 'Unknown';

  if (deviceInfo && deviceInfo.device) {
    deviceType = deviceInfo.device.type || 'Unknown';
  }
  if (deviceInfo && deviceInfo.os) {
    os = deviceInfo.os.name || 'Unknown';
  }
  if (deviceInfo && deviceInfo.client) {
    browser = deviceInfo.client.name || 'Unknown';
  }

  const ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.connection.remoteAddress;
  const location = geoip.lookup(ip);

  return {
    device: `${deviceType} ${os}`,
    ip: ip,
    location: location ? `${location.city}, ${location.country}` : 'Unknown',
    browser: browser,
  };
};

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    console.log('token', token);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newloginDetails = await Device.findOne({
      userId: user._id.toString(),
    });
    if (!newloginDetails) {
      return res
        .status(404)
        .json({ message: 'please login to perform this action' });
    }

    const verifyDevice = await checkIfCurrentDeviceMatchAnyInDb({
      newloginDetails,
      req,
    });
    console.log('checkIfCurrentDeviceMatchDb', verifyDevice);

    if (!verifyDevice) {
      console.error('Verification failed, switch off VPN if active');

      return res
        .status(401)
        .json({ message: 'verification fail, switch off VPN if active' });
    }

    const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    res.cookie('auth_token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    console.log('newtoken', newToken);

    req.device = verifyDevice.device;
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
