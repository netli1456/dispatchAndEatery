export const emailText = (device) => {
  return {
    newUserText: 'Welcome to M-bite! Your verification code is',
    newUserSubject: 'Email verification',
    newUserWarning: 'Please do not disclose this code to anyone.',
    appreciation: 'Thank you, The M-bite Team',
    newLoginText: `We detected a new device login to your M-bite account on ${device.device} from ${device.location === 'Unknown' ? `an unknown location` : `${device.location}`} on ${device.browser} browser. 
       If you did not initiate this login, please change your password to secure your account immediately or contact the customer support  @officialmbite@gmail.com.`,
    newLoginWarning: 'Please do not disclose this code to anyone',
    newLoginSubject: 'New login detected',
    passwordChangeText:'We received a request to reset your password for your Mbite account. If you made this request, please use the verification code below to complete the process',
    passwordChangeWarning:'For your security, this code will expire in 1 hour.If you did not request a password change, please ignore this email or contact our support team immediately @officialmbite@gmail.com',
    passwordChangeSubject:'Password change comfirmation',
  };
};
