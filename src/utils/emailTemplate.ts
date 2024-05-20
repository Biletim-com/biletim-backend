const RESET_PASSWORD_EMAIL_TEMPLATE = (
  header: string,
  content: string,
  buttonText: string,
  htmlLink: string,
) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Poppins', sans-serif;">
      
        <div style="max-width: 600px; margin: 20px auto; text-align: center;">
      
          <div style="background-color: #ffffff; border-radius: 12px; padding: 20px; margin: 20px 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      
            <!-- Top blue line -->
            <hr style="border: none; height: 3px; background-color: 
    #21A7F9; margin: 0;">
      
            <!-- Header -->
            <h1 style="font-size: 36px; margin: 20px 0; color: black">${header}</h1>
      
            <!-- Gray horizontal divider -->
            <hr style="border: none; height: 1px; background-color: #ddd; margin: 20px 0;">
      
            <!-- Reset password link -->
            <p style="margin: 0;">${content}</p>
      
            <!-- Confirm email button -->
            <div style="display: inline-block; padding: 10px 20px; background-color: 
    #21A7F9; color: #fff; text-decoration: none; border-radius: 5px; text-align: center; margin: 20px 0;">
              <a href="${htmlLink}" style="text-decoration: none; color: #fff;">${buttonText}</a>
            </div>
           
      
          </div>
       <p style="color: grey; font-size: 12px;">DWS - Tool Manager is the product of Westerops. All rights reserved.<br/>
       Got questions? email us at <a href="mailto:info@westerops.com">info@westerops.com</a>
       </p>
        </div>
      
      </body>
      </html>
      
     `;
};

const SIGNUP_VERIFY_EMAIL_TEMPLATE = (
  header: string,
  content: string,
  code: string,
) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: 'Poppins', sans-serif;">
      
        <div style="max-width: 600px; margin: 20px auto; text-align: center;">
      
          <div style="background-color: #ffffff; border-radius: 12px; padding: 20px; margin: 20px 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      
            <!-- Top blue line -->
            <hr style="border: none; height: 3px; background-color: 
    #21A7F9; margin: 0;">
      
            <!-- Header -->
            <h1 style="font-size: 36px; margin: 20px 0; color: black">${header}</h1>
      
            <!-- Gray horizontal divider -->
            <hr style="border: none; height: 1px; background-color: #ddd; margin: 20px 0;">
      
            <!-- Reset password link -->
            <p style="margin: 0;">${content}</p>
      
            <!-- Confirm email button -->
            <div style="display: inline-block; padding: 10px 20px; background-color: 
    #21A7F9; color: #fff; text-decoration: none; border-radius: 5px; text-align: center; margin: 20px 0;">
              <p>${code}</p>
            </div>
           
      
          </div>
       <p style="color: grey; font-size: 12px;">DWS - Tool Manager is the product of Westerops. All rights reserved.<br/>
       Got questions? email us at <a href="mailto:info@westerops.com">info@westerops.com</a>
       </p>
        </div>
      
      </body>
      </html>
      
     `;
};

export { RESET_PASSWORD_EMAIL_TEMPLATE, SIGNUP_VERIFY_EMAIL_TEMPLATE };
