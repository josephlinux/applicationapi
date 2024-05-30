const AWS = require("aws-sdk");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs").promises;
const mainmdl = require('../model/MainMdl');
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

exports.test1=async(req,res)=>{
  mainmdl.test1(function (err, data) {
    if (err) {
      logger.error('Error While Getting get_ip_wishList_Data ', err);
      res.send({ "code": stdCodes.message.serverError.code, "message": stdCodes.message.serverError.message });
  } else {
      res.send({ code: 200, data: data });
  }
  });
}

exports.PublicPortalContactForm = async (req, res) => {
  const { subject, first_name, email_address, mobile_number, address_details, remarks_info } = req.body;
  const fromAddress = process.env.FROM_EMAIL;
  const sourceArn = process.env.SOURCE_ARN;

  if (!subject || !first_name || !email_address || !mobile_number || !address_details || !remarks_info) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const isVerified = await isEmailAddressVerifiedInSandbox(email_address);

    if (!isVerified) {
      await sendVerificationEmail(email_address);
      return res.send("Verification email sent. Please verify your email address.");
    }

    const htmlBody = await renderEmailTemplate("email_template.ejs", { first_name, email_address, mobile_number, address_details, remarks_info });

    const params = {
      Destination: {
        ToAddresses: [email_address]
      },
      Message: {
        Body: {
          Html: { Data: htmlBody }
        },
        Subject: { Data: subject }
      },
      Source: fromAddress,
      SourceArn: sourceArn
    };

    const data = await ses.sendEmail(params).promise();
    console.log(data);
    res.send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};

async function renderEmailTemplate(templateName, data) {
  try {
    const templatePath = path.join(__dirname, "../views", templateName);
    const templateContent = await fs.readFile(templatePath, "utf8");
    return ejs.render(templateContent, data);
  } catch (error) {
    console.error("Error rendering email template:", error);
    throw error;
  }
}

async function isEmailAddressVerifiedInSandbox(emailAddress) {
  const params = {
    Identities: [emailAddress]
  };

  try {
    const data = await ses.getIdentityVerificationAttributes(params).promise();
    const status = data.VerificationAttributes[emailAddress]?.VerificationStatus;
    console.log(`Verification status for ${emailAddress}: ${status}`);
    return status === "Success";
  } catch (error) {
    console.error("Error fetching verification attributes:", error);
    throw new Error("Could not verify email address status.");
  }
}

async function sendVerificationEmail(emailAddress) {
  const params = {
    EmailAddress: emailAddress
  };

  try {
    await ses.verifyEmailAddress(params).promise();
    console.log("Verification email sent to:", emailAddress);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}
