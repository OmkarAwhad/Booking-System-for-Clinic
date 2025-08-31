exports.reminderEmail = (patientName, appointmentDate, appointmentTime) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8" />
   <title>Appointment Reminder — Our Clinic</title>
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <style>
      body {
         margin: 0;
         padding: 0;
         background-color: #ffffff;
         font-family: Arial, Helvetica, sans-serif;
         color: #333333;
         -webkit-text-size-adjust: 100%;
         -ms-text-size-adjust: 100%;
      }
      .wrapper {
         width: 100%;
         table-layout: fixed;
         background-color: #ffffff;
         padding: 0;
      }
      .main {
         background-color: #ffffff;
         margin: 0 auto;
         width: 100%;
         max-width: 600px;
         border-spacing: 0;
         font-size: 16px;
         line-height: 1.5;
         color: #333333;
      }
      .spacer {
         height: 24px;
         line-height: 24px;
         font-size: 24px;
      }
      .header {
         text-align: center;
         padding: 24px 24px 8px 24px;
      }
      .brand {
         font-size: 20px;
         font-weight: bold;
         color: #000000;
         letter-spacing: 0.3px;
         text-decoration: none;
      }
      .hero {
         padding: 8px 24px 0 24px;
         text-align: center;
      }
      .title {
         font-size: 22px;
         font-weight: bold;
         margin: 0 0 8px 0;
         color: #000000;
      }
      .subtitle {
         font-size: 15px;
         color: #555555;
         margin: 0 0 16px 0;
      }
      .card {
         margin: 0 24px;
         border: 1px solid #e5e7eb;
         border-radius: 8px;
         padding: 16px;
         background: #ffffff;
      }
      .row {
         display: block;
         margin: 8px 0;
      }
      .label {
         display: block;
         font-size: 13px;
         color: #6b7280;
         margin-bottom: 2px;
      }
      .value {
         font-size: 16px;
         color: #111827;
         word-break: break-all;
      }
      .cta-wrap {
         text-align: center;
         padding: 12px 24px 4px 24px;
      }
      .cta {
         display: inline-block;
         padding: 12px 18px;
         background-color: #000000;
         color: #ffffff !important;
         text-decoration: none;
         border-radius: 6px;
         font-weight: bold;
         font-size: 14px;
      }
      .note {
         font-size: 13px;
         color: #6b7280;
         padding: 8px 24px 0 24px;
         line-height: 1.6;
      }
      .footer {
         text-align: center;
         font-size: 12px;
         color: #9ca3af;
         padding: 20px 24px 28px 24px;
      }
      .highlight {
         font-weight: bold;
         color: #000000;
      }
      @media (max-width: 620px) {
         .title { font-size: 20px; }
         .subtitle { font-size: 14px; }
         .cta { width: 100%; }
         .card { margin: 0 16px; }
      }
   </style>
</head>
<body>
   <center class="wrapper">
      <table class="main" role="presentation" cellpadding="0" cellspacing="0" width="100%">
         <tr>
            <td class="header">
               <a href="#" class="brand">Our Clinic</a>
            </td>
         </tr>
         <tr><td class="spacer"></td></tr>
         <tr>
            <td class="hero">
               <h1 class="title">Appointment Reminder</h1>
               <p class="subtitle">Dear ${patientName}, your appointment is today!</p>
            </td>
         </tr>
         <tr>
            <td>
               <div class="card">
                  <div class="row">
                     <span class="label">Date</span>
                     <span class="value">${new Date(
						appointmentDate
					).toLocaleDateString()}</span>
                  </div>
                  <div class="row">
                     <span class="label">Time</span>
                     <span class="value">${appointmentTime}</span>
                  </div>
               </div>
            </td>
         </tr>
         <tr><td class="spacer"></td></tr>
         <tr>
            <td class="cta-wrap">
               <a class="cta" href="#" target="_blank" rel="noopener noreferrer">View Appointment Details</a>
            </td>
         </tr>
         <tr>
            <td class="note">
               Please arrive a few minutes early. If you need to reschedule or cancel, contact us at <a href="mailto:support@forever.com">support@forever.com</a>.
            </td>
         </tr>
         <tr>
            <td class="footer">
               © ${new Date().getFullYear()} Forever. All rights reserved.
            </td>
         </tr>
      </table>
   </center>
</body>
</html>`;
};
