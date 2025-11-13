import otp from "otp-generators"
export const generateOtp = () => {
  const result = otp.generate(6, { alphabets: false, upperCase: false, specialChar: false })
  return result
}