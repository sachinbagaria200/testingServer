const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../schemas/userSchema");
const validateCustomerCases = require("../utils/validateCustomerCases");
// Encryption key (keep this secret and secure)
const encryptionKey = process.env.REACT_APP_API_ENCRYPTION_KEY;

const staticUserInfo = {
  Username: process.env.REACT_APP_API_STATIC_USERNAME,
  Password: process.env.REACT_APP_API_STATIC_PASSWORD,
};

router.post("/SearchCustomers", async (req, res) => {
  const SearchParam = req.body.SearchParam;
  const tokenRef = res.locals.tokenUserRef;
  if (tokenRef != SearchParam) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    SearchParam: SearchParam,
    UserInfo: staticUserInfo,
  };
  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/SearchCustomers`;
    const response = await axios.post(apiUrl, payload);

    const customerCasesObj = response.data?.d?.Records[0]?.CustomerCases || [];
    const customerCasesCode = customerCasesObj.map(
      (transaction) => transaction.CaseRef
    );
    try {
      await User.updateOne(
        { customerReference: SearchParam },
        { $set: { customerCases: customerCasesCode } }
      );
    } catch (e) {
      console.log(e);
    }

    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetCase", async (req, res) => {
  const CaseReference = req.body.CaseReference;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    CaseReference
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    CaseReference: CaseReference,
    UserInfo: staticUserInfo,
  };
  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetCase`;
    const response = await axios.post(apiUrl, payload);
    if (tokenRef != response.data.d?.CaseApplicant?.CustomerReference) {
      return res.status(401).json("Unauthorized request, please try again");
    } else {
      res.status(200).json(response.data);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetADPData", async (req, res) => {
  const CaseReference = req.body.CaseReference;
  const tokenRef = res.locals.tokenUserRef;
  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    CaseReference
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    CaseReference: CaseReference,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetADPData`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetOpenBankingStatus", async (req, res) => {
  const pRequest = req.body.pRequest;
  const tokenRef = res.locals.tokenUserRef;

  if (tokenRef != pRequest.CustomerCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    pRequest,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetOpenBankingStatus`;
    const response = await axios.post(apiUrl, payload);

    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetFinancialTransactions", async (req, res) => {
  const remainingFinancialTransactionsData = { ...req.body };
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    remainingFinancialTransactionsData.Reference
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  delete remainingFinancialTransactionsData.UserInfoNew;

  const payload = {
    ...remainingFinancialTransactionsData,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetFinancialTransactions`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/OrdoVRPCreateMandate", async (req, res) => {
  const MandateData = req.body.MandateData;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    MandateData.CaseReference
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    MandateData,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/OrdoVRPCreateMandate`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check
router.post(
  "/accessPaysuiteIsStartDateValidatForContract",
  async (req, res) => {
    const StartDate = req.body.StartDate;

    const payload = {
      StartDate,
      UserInfo: staticUserInfo,
    };

    try {
      const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/accessPaysuiteIsStartDateValidatForContract`;
      const response = await axios.post(apiUrl, payload);
      res.status(200).json(response.data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching data from the API." });
    }
  }
);
//pending security check don't know applicant id
router.post("/IsAccessPaysuiteCustomerCreated", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    ApplicantID
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    ApplicantID,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/IsAccessPaysuiteCustomerCreated`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check don't know applicant id
router.post("/AccessPaysuiteCreateCustomer", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const Customer = req.body.Customer;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    ApplicantID
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    ApplicantID,
    Customer,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/AccessPaysuiteCreateCustomer`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check don't know applicant id
router.post("/IsAccessPaysuiteContractCreated", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    ApplicantID
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    ApplicantID,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/IsAccessPaysuiteContractCreated`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check don't know applicant id
router.post("/AccessPaysuiteCreateContract", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const ScheduleId = req.body.ScheduleId;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    ApplicantID
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    ApplicantID,
    ScheduleId,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/AccessPaysuiteCreateContract`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check don't know applicant id
router.post("/AccessPaysuiteCancelContract", async (req, res) => {
  const ApplicantID = req.body.ApplicantID;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    ApplicantID
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    ApplicantID,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/AccessPaysuiteCancelContract`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/OrdoVRPCancelMandate", async (req, res) => {
  const CaseReference = req.body.CaseReference;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    CaseReference
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    CaseReference,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/OrdoVRPCancelMandate`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/CaseRecalculatePaymentPlan", async (req, res) => {
  const pRequest = req.body.pRequest;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    pRequest.CaseRef
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    UserInfo: staticUserInfo,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/CaseRecalculatePaymentPlan`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/UpdatePaymentPlanHolidays", async (req, res) => {
  const pRequest = req.body.pRequest;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    pRequest.CaseReference
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    pRequest,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdatePaymentPlanHolidays`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/OpenBankingHandShakeInvoke", async (req, res) => {
  const pRequest = req.body.pRequest;
  const tokenRef = res.locals.tokenUserRef;

  if (tokenRef != pRequest.CustomerCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    pRequest,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/OpenBankingHandShakeInvoke`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//No security check added
router.post("/getPostcodeLookup", async (req, res) => {
  const pRequest = req.body.pRequest;

  const payload = {
    pRequest,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/getPostcodeLookup`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/GetInvoiceTerms", async (req, res) => {
  const IncludeRefund = req.body.IncludeRefunds;
  const Reference = req.body.Reference;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    Reference
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    UserInfo: staticUserInfo,
    IncludeRefunds: IncludeRefund,
    Reference,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/GetInvoiceTerms`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/OrdoCollectPayment", async (req, res) => {
  const PaymentInfo = req.body.PaymentInfo;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    PaymentInfo.CaseReference
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    UserInfo: staticUserInfo,
    PaymentInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/OrdoCollectPayment`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/UpdateCustomer", async (req, res) => {
  const Customer = req.body.Customer;
  const tokenRef = res.locals.tokenUserRef;

  // if (tokenRef != Customer.CustomerReference) {
  //   return res.status(401).json("Unauthorized request, please try again");
  // }

  const payload = {
    UserInfo: staticUserInfo,
    Customer,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdateCustomer`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/UpdateCaseLockPaymentPlan", async (req, res) => {
  const ApplicantID = req.body.CaseReference;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    ApplicantID
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }

  const payload = {
    UserInfo: staticUserInfo,
    CaseReference: ApplicantID,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdateCaseLockPaymentPlan`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check don't know applicant id
router.post("/CreateDocumentToPdf", async (req, res) => {
  const pRequest = req.body.pRequest;

  const payload = {
    UserInfo: staticUserInfo,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/CreateDocumentToPdf`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check
router.post("/FetchifyMobileVerification", async (req, res) => {
  const pRequest = req.body.pRequest;

  const payload = {
    UserInfo: staticUserInfo,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/FetchifyMobileVerification`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check
router.post("/FetchifyEmailVerification", async (req, res) => {
  const pRequest = req.body.pRequest;

  const payload = {
    UserInfo: staticUserInfo,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/FetchifyEmailVerification`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/InvokeADPCall", async (req, res) => {
  const pRequest = req.body.pRequest;
  const tokenRef = res.locals.tokenUserRef;

  let isValidCustomerCasesCode = await validateCustomerCases(
    tokenRef,
    pRequest.CaseRef
  );
  if (!isValidCustomerCasesCode) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    UserInfo: staticUserInfo,
    pRequest,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/InvokeADPCall`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

//pending security check
router.post("/CreateCaseJSON", async (req, res) => {
  const CaseType = req.body.CaseType;
  const CaseParams = req.body.CaseParams;

  const payload = {
    UserInfo: staticUserInfo,
    CaseType,
    CaseParams,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/CreateCaseJSON`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/UpdateCase", async (req, res) => {
  const CaseApp = req.body.CaseApp;
  const tokenRef = res.locals.tokenUserRef;

  if (tokenRef != CaseApp.CustomerReference) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    CaseApp,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdateCase`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

router.post("/updateCaseCancellable", async (req, res) => {
  const CaseApp = req.body.CaseApp;
  const tokenRef = res.locals.tokenUserRef;
  if (tokenRef != CaseApp.CustomerReference) {
    return res.status(401).json("Unauthorized request, please try again");
  }
  const payload = {
    CaseApp,
    UserInfo: staticUserInfo,
  };

  try {
    const apiUrl = `${process.env.REACT_APP_API_CRM_BASE_URL}/UpdateCase`;
    const response = await axios.post(apiUrl, payload);
    res.status(200).json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching data from the API." });
  }
});

module.exports = router;
