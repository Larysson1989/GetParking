export const maskPhone = (value: string) => {
  if (!value) return "";
  
  // Remove everything that is not a digit
  const digits = value.replace(/\D/g, "");
  
  // Limit to 11 digits
  const limitedDigits = digits.slice(0, 11);
  
  let masked = limitedDigits;
  
  if (limitedDigits.length > 0) {
    masked = `(${limitedDigits.slice(0, 2)}`;
  }
  
  if (limitedDigits.length > 2) {
    masked += `) ${limitedDigits.slice(2, 3)}`;
  }
  
  if (limitedDigits.length > 3) {
    masked += ` ${limitedDigits.slice(3, 7)}`;
  }
  
  if (limitedDigits.length > 7) {
    masked += `-${limitedDigits.slice(7, 11)}`;
  }
  
  return masked;
};

export const unmaskPhone = (value: string) => {
  return value.replace(/\D/g, "");
};
