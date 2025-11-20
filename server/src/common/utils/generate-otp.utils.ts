export class GenerateOTP {
  static generateOtp(length: number = 6): string {
    if (length < 4 || length > 10) {
      throw new Error('OTP length must be between 4 and 10 digits');
    }

    const min = Math.pow(10, length - 1); // For length 6: 10^5 = 100000
    const max = Math.pow(10, length) - 1; // For length 6: 10^6 - 1 = 999999

    // Example calculation:
    // min = 100000
    // max = 999999
    // max - min = 899999
    // Math.random() = 0.5 (example)
    // 0.5 * 899999 = 449999.5
    // min + 449999.5 = 549999.5
    // Math.floor(549999.5) = 549999
    // toString() = "549999"
    return Math.floor(min + Math.random() * (max - min)).toString();
  }

  static generateNumericOtp(): string {
    return this.generateOtp(6);
  }

  static generateAlphanumericOtp(length: number = 6): string {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let otp = '';

    for (let i = 0; i < length; i++) {
      otp += chars[Math.floor(Math.random() * chars.length)];
    }

    return otp;
  }

  /* 
the below generateWordOtp generate the code like this
 // Returns "TEST1234"
   * GenerateOTP.generateWordOtp("TEST", 8)
   * 
   * // Returns "HELLO5B2"
   * GenerateOTP.generateWordOtp("HELLO", 8)
   * 
   * // Throws Error: Word length must be less than total OTP length
   * GenerateOTP.generateWordOtp("TOOLONG", 6)
*/
  static generateWordOtp(word: string, totalLength: number = 8): string {
    if (!word || word.length >= totalLength) {
      throw new Error('Word length must be less than total OTP length');
    }

    // Convert word to uppercase
    const upperWord = word.toUpperCase();

    // Calculate remaining length and generate random part
    const remainingLength = totalLength - upperWord.length;
    const randomPart = this.generateAlphanumericOtp(remainingLength);

    // Combine word and random part
    return upperWord + randomPart;
  }
}
