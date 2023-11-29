const User = require("../schemas/userSchema");

const validateCustomerCases = async (tokenRef, customerCasesCode) => {
  const userData = await User.findOne({ customerReference: tokenRef });
  if (userData.customerCases && customerCasesCode) {
    return userData.customerCases.includes(customerCasesCode);
  } else {
    return false;
  }
};
module.exports = validateCustomerCases;
