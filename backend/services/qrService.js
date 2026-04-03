const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

class QRService {
  async generateQRData(redemptionId, offerId, userId) {
    const token = uuidv4();
    const qrData = JSON.stringify({
      redemptionId,
      offerId,
      userId,
      token,
      timestamp: Date.now()
    });
    return { token, qrData };
  }

  async generateQRCode(qrData) {
    try {
      const qrCodeImage = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      return qrCodeImage;
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  async generateQRCodeURL(qrData) {
    try {
      const qrCodeURL = await QRCode.toDataURL(qrData);
      return qrCodeURL;
    } catch (error) {
      throw new Error('Failed to generate QR code URL');
    }
  }

  parseQRData(qrDataString) {
    try {
      return JSON.parse(qrDataString);
    } catch (error) {
      return null;
    }
  }

  validateToken(token) {
    return token && token.length > 0;
  }
}

module.exports = new QRService();
