const OTP = require('../models/OTP');

class OTPService {
  constructor() {
    this.MOCK_OTP = '123456';
    this.OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
    this.MAX_ATTEMPTS = 3;
  }

  async sendOTP(phone) {
    // In development mode, always use mock OTP
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] OTP for ${phone}: ${this.MOCK_OTP}`);
      
      // Clean old OTPs for this phone
      await OTP.deleteMany({ phone });
      
      // Create new OTP
      const otp = new OTP({
        phone,
        otp: this.MOCK_OTP,
        expiresAt: new Date(Date.now() + this.OTP_EXPIRY_MS)
      });
      
      await otp.save();
      return true;
    }
    
    // Production: Send real SMS here
    // For now, same as development
    console.log(`[PROD] OTP for ${phone}: ${this.MOCK_OTP}`);
    
    await OTP.deleteMany({ phone });
    
    const otp = new OTP({
      phone,
      otp: this.MOCK_OTP,
      expiresAt: new Date(Date.now() + this.OTP_EXPIRY_MS)
    });
    
    await otp.save();
    return true;
  }

  async verifyOTP(phone, otp) {
    // Find the latest OTP for this phone
    const otpRecord = await OTP.findOne({
      phone,
      verified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return { valid: false, error: 'OTP not found' };
    }

    // Check if expired
    if (new Date() > otpRecord.expiresAt) {
      return { valid: false, error: 'OTP has expired' };
    }

    // Check attempts
    if (otpRecord.attempts >= this.MAX_ATTEMPTS) {
      return { valid: false, error: 'Maximum attempts exceeded' };
    }

    // In development, accept 123456
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
      if (otp === this.MOCK_OTP) {
        otpRecord.verified = true;
        await otpRecord.save();
        return { valid: true };
      }
    }

    // Check actual OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return { valid: false, error: 'Invalid OTP' };
    }

    otpRecord.verified = true;
    await otpRecord.save();
    return { valid: true };
  }

  async cleanup(phone) {
    await OTP.deleteMany({ phone });
  }
}

module.exports = new OTPService();
