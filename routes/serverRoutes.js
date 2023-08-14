const express = require("express");
const router = express.Router();
const axios = require("axios");
const CryptoJS = require("crypto-js");

// Encryption key (keep this secret and secure)
const encryptionKey = "dshruxanqkxaldeicnsana";

router.post("/SearchCustomers", async (req, res) => {
  const CustomerReferencDcrypt = req.body.SearchParam;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data
  const deCrptCustomerReferencString = CryptoJS.AES.decrypt(
    CustomerReferencDcrypt,
    encryptionKey
  ).toString(CryptoJS.enc.Utf8);

  let deCrptCustomerReferenc = deCrptCustomerReferencString.replace(
    /^['"]|['"]$/g,
    ""
  );

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    SearchParam: deCrptCustomerReferenc,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/SearchCustomers`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetCase", async (req, res) => {
  const CaseReferenceDcrypt = req.body.CaseReference;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data
  const deCrptCaseReferenceString = CryptoJS.AES.decrypt(
    CaseReferenceDcrypt,
    encryptionKey
  ).toString(CryptoJS.enc.Utf8);

  let deCrptCaseReference = deCrptCaseReferenceString.replace(
    /^['"]|['"]$/g,
    ""
  );

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    CaseReference: deCrptCaseReference,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetCase`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetADPData", async (req, res) => {
  const CaseReferenceDcrypt = req.body.CaseReference;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data
  const deCrptCaseReferenceString = CryptoJS.AES.decrypt(
    CaseReferenceDcrypt,
    encryptionKey
  ).toString(CryptoJS.enc.Utf8);

  let deCrptCaseReference = deCrptCaseReferenceString.replace(
    /^['"]|['"]$/g,
    ""
  );

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    CaseReference: deCrptCaseReference,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetADPData`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetOpenBankingStatus", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    pRequest,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetOpenBankingStatus`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetFinancialTransactions", async (req, res) => {
  const UserInfoNewcDcrypt = req.body.UserInfoNew;
  const remainingFinancialTransactionsData = { ...req.body };

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  delete remainingFinancialTransactionsData.UserInfoNew;

  const decryptedUserDetails = {
    ...remainingFinancialTransactionsData,
    UserInfo: decryptedUserInfoData,
  };

  console.log("decryptedUserDetails", decryptedUserDetails);

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetFinancialTransactions`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/OrdoVRPCreateMandate", async (req, res) => {
  const MandateData = req.body.MandateData;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    MandateData,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/OrdoVRPCreateMandate`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post(
  "/accessPaysuiteIsStartDateValidatForContract",
  async (req, res) => {
    const StartDate = req.body.StartDate;
    const UserInfoNewcDcrypt = req.body.UserInfoNew;

    // Decrypt the data

    const userInfobytes = CryptoJS.AES.decrypt(
      UserInfoNewcDcrypt,
      encryptionKey
    );
    const decryptedUserInfoData = JSON.parse(
      userInfobytes.toString(CryptoJS.enc.Utf8)
    );

    const decryptedUserDetails = {
      StartDate,
      UserInfo: decryptedUserInfoData,
    };

    try {
      const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/accessPaysuiteIsStartDateValidatForContract`;
      const response = await axios.post(apiUrl, decryptedUserDetails);
      res.status(200).json(response.data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching data from the API." });
    }
  }
);

router.post("/IsAccessPaysuiteCustomerCreated", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    ApplicantID,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/IsAccessPaysuiteCustomerCreated`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/AccessPaysuiteCreateCustomer", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;
  const Customer = req.body.Customer;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    ApplicantID,
    Customer,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/AccessPaysuiteCreateCustomer`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});
router.post("/IsAccessPaysuiteContractCreated", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    ApplicantID,

    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/IsAccessPaysuiteContractCreated`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/AccessPaysuiteCreateContract", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;
  const ScheduleId = req.body.ScheduleId;
  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    ApplicantID,
    ScheduleId,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/AccessPaysuiteCreateContract`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/AccessPaysuiteCancelContract", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    ApplicantID,
    UserInfo: decryptedUserInfoData,
  };

  console.log("decryptedUserDetails", decryptedUserDetails);

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/AccessPaysuiteCancelContract`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/OrdoVRPCancelMandate", async (req, res) => {
  const CaseReference = req.body.CaseReference;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    CaseReference,
    UserInfo: decryptedUserInfoData,
  };

  console.log("decryptedUserDetails", decryptedUserDetails);

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/OrdoVRPCancelMandate`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/CaseRecalculatePaymentPlan", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    pRequest,
  };

  console.log("decryptedUserDetails", decryptedUserDetails);

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/CaseRecalculatePaymentPlan`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/UpdatePaymentPlanHolidays", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    pRequest,
    UserInfo: decryptedUserInfoData,
  };

  console.log("decryptedUserDetails", decryptedUserDetails);

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdatePaymentPlanHolidays`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/OpenBankingHandShakeInvoke", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    pRequest,
    UserInfo: decryptedUserInfoData,
  };

  console.log("decryptedUserDetails", decryptedUserDetails);

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/OpenBankingHandShakeInvoke`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/getPostcodeLookup", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    pRequest,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/getPostcodeLookup`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetInvoiceTerms", async (req, res) => {
  const IncludeRefund = req.body.IncludeRefunds;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;
  const Reference = req.body.Reference;
  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    IncludeRefunds: IncludeRefund,
    Reference,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetInvoiceTerms`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});
router.post("/OrdoCollectPayment", async (req, res) => {
  const PaymentInfo = req.body.PaymentInfo;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    PaymentInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/OrdoCollectPayment`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/UpdateCustomer", async (req, res) => {
  const Customer = req.body.Customer;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    Customer,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdateCustomer`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/UpdateCaseLockPaymentPlan", async (req, res) => {
  const ApplicantID = req.body.CaseReference;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    CaseReference: ApplicantID,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdateCaseLockPaymentPlan`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/CreateDocumentToPdf", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/CreateDocumentToPdf`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/FetchifyMobileVerification", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/FetchifyMobileVerification`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/FetchifyEmailVerification", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/FetchifyEmailVerification`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/InvokeADPCall", async (req, res) => {
  const pRequest = req.body.pRequest;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/InvokeADPCall`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/CreateCaseJSON", async (req, res) => {
  const CaseType = req.body.CaseType;
  const CaseParams = req.body.CaseParams;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    UserInfo: decryptedUserInfoData,
    CaseType,
    CaseParams,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/CreateCaseJSON`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/UpdateCase", async (req, res) => {
  const CaseApp = req.body.CaseApp;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    CaseApp,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdateCase`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/updateCaseCancellable", async (req, res) => {
  const CaseApp = req.body.CaseApp;
  const UserInfoNewcDcrypt = req.body.UserInfoNew;

  // Decrypt the data

  const userInfobytes = CryptoJS.AES.decrypt(UserInfoNewcDcrypt, encryptionKey);
  const decryptedUserInfoData = JSON.parse(
    userInfobytes.toString(CryptoJS.enc.Utf8)
  );

  const decryptedUserDetails = {
    CaseApp,
    UserInfo: decryptedUserInfoData,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdateCase`;
    const response = await axios.post(apiUrl, decryptedUserDetails);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

module.exports = router;
