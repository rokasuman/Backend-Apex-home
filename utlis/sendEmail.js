

const sendEmail = async (option) => {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();

    if (!BREVO_API_KEY) {
      throw new Error("Missing BREVO_API_KEY in .env file");
    }

    const data = {
      sender: {
        name: "Realestate Platform",
        email: process.env.EMAIL_USER,
      },
      to: [{ email: option.email }],
      subject: option.subject,
      htmlContent: option.message,
    };

    //  send the request to Brevo
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
  console.log("Email send SuccessFully",result.messageId)
    } else{
        console.log("Brevo api error",result)
    }
  } catch (error) {
    // proper error logging
    console.error(
      " Email sending failed:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to send email");
  }
};

export default sendEmail;



