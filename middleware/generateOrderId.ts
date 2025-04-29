const generateOtp = (num: number): string => {
    let otp = "";
    for (let i = 0; i < num; i++) {
      otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
    }
    return otp;
  };

  export default generateOtp;