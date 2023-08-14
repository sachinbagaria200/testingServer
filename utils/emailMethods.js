const msal = require("@azure/msal-node");
const { default: axios } = require("axios");

const tenantId = process.env.OFFICE_365_TENANTID,
  clientId = process.env.OFFICE_365_CLIENTID,
  clientSecret = process.env.OFFICE_365_CLIENTSECRET;

const sendEmail = async (emailOptions) => {
  const { subject, to, from, html } = emailOptions;
  try {
    const aadEndpoint =
      process.env.AAD_ENDPOINT || "https://login.microsoftonline.com";
    const graphEndpoint =
      process.env.GRAPH_ENDPOINT || "https://graph.microsoft.com";

    const msalConfig = {
      auth: {
        clientId,
        clientSecret,
        authority: aadEndpoint + "/" + tenantId,
      },
    };

    const tokenRequest = {
      scopes: [graphEndpoint + "/.default"],
    };

    const cca = new msal.ConfidentialClientApplication(msalConfig);
    const tokenInfo = await cca.acquireTokenByClientCredential(tokenRequest);

    const mail = {
      subject,
      from: {
        emailAddress: {
          address: from,
        },
      },
      toRecipients: [
        {
          emailAddress: {
            address: to,
          },
        },
      ],
      body: {
        content: html,
        contentType: "html",
      },
    };

    const bearer = `Bearer ${tokenInfo.accessToken}`;

    const response = await axios.post(
      graphEndpoint + `/v1.0/users/${process.env.EMAIL}/sendMail`,
      { message: mail, saveToSentItems: true },
      {
        headers: {
          Authorization: bearer,
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.status === 202) {
      console.log("Email Sent!");
      return;
    } else console.log("Error occured while sending email");
  } catch (error) {
    console.log("Error", error);
  }
};

module.exports = sendEmail;
