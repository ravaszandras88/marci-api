export interface MentoringConfirmationData {
  customerName: string;
  customerEmail: string;
  paymentAmount: string;
  sessionId: string;
}

export function generateMentoringConfirmationEmail(data: MentoringConfirmationData) {
  const { customerName, customerEmail, paymentAmount, sessionId } = data;

  const subject = "🎉 Your 1-on-1 Mentoring Session with Marcel Nyirő is Confirmed!";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mentoring Session Confirmed</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 0 20px; }
            .highlight-box { background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; text-align: center; }
            .cta-button:hover { opacity: 0.9; }
            .session-details { background-color: #f0f9ff; border: 1px solid #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .session-details h3 { color: #1e40af; margin-top: 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; border-top: 1px solid #eee; margin-top: 30px; }
            .social-links { margin: 20px 0; }
            .social-links a { color: #6366f1; text-decoration: none; margin: 0 10px; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Mentoring Session Confirmed!</h1>
                <p>Thank you for booking with Marcel Nyirő</p>
            </div>
            
            <div class="content">
                <p>Hi <strong>${customerName}</strong>,</p>
                
                <p>Fantastic news! Your payment of <strong>${paymentAmount}</strong> has been successfully processed, and your 1-on-1 mentoring session with Marcel Nyirő is now confirmed.</p>
                
                <div class="session-details">
                    <h3>📅 Next Steps - Schedule Your Session</h3>
                    <p>To complete your booking, please select a convenient time slot using Marcel's calendar:</p>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="https://calendly.com/marcelnyiro" class="cta-button" style="color: white;">
                            📅 Schedule Your 1-Hour Session
                        </a>
                    </div>
                    
                    <p><strong>Important:</strong> Please book your session within the next 7 days to ensure availability.</p>
                </div>

                <div class="highlight-box">
                    <h3>💡 What You'll Get in Your Session:</h3>
                    <ul>
                        <li><strong>1-hour deep-dive session</strong> - Comprehensive review of your business</li>
                        <li><strong>Personalized business strategy</strong> - Tailored to your specific goals</li>
                        <li><strong>AI implementation roadmap</strong> - Practical steps to integrate AI</li>
                        <li><strong>Investor pitch feedback</strong> - Optimize your fundraising approach</li>
                        <li><strong>Network introductions</strong> - Access to Marcel's exclusive network</li>
                        <li><strong>Follow-up email</strong> - Key takeaways and action items</li>
                    </ul>
                </div>

                <div class="highlight-box">
                    <h3>🚀 About Marcel Nyirő:</h3>
                    <p>Marcel is the founder of <strong>Outfino</strong>, an AI-powered fashion platform that secured <strong>73M HUF investment from OUVC</strong>. He's been featured in Portfolio.hu and Growth Magazine, with a proven track record of building successful AI-driven businesses.</p>
                </div>

                <h3>📧 Questions or Need Help?</h3>
                <p>If you have any questions or need to reschedule, feel free to reach out:</p>
                <ul>
                    <li>Email: <a href="mailto:marcel@marcelnyiro.com">marcel@marcelnyiro.com</a></li>
                    <li>Website: <a href="https://marcelnyiro.com">marcelnyiro.com</a></li>
                </ul>

                <p>Looking forward to our session and helping you achieve your entrepreneurial goals!</p>
                
                <p>Best regards,<br>
                <strong>Marcel Nyirő</strong><br>
                AI Entrepreneur & Strategic Advisor</p>
            </div>

            <div class="footer">
                <div class="social-links">
                    <a href="https://linkedin.com/in/marcelnyiro">LinkedIn</a> |
                    <a href="https://marcelnyiro.com">Website</a> |
                    <a href="mailto:marcel@marcelnyiro.com">Email</a>
                </div>
                <p>Payment Reference: ${sessionId}</p>
                <p>&copy; 2024 Marcel Nyirő. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textContent = `
    Hi ${customerName},

    Your 1-on-1 mentoring session with Marcel Nyirő is confirmed!

    Payment of ${paymentAmount} has been successfully processed.

    NEXT STEP - Schedule Your Session:
    Please visit Marcel's calendar to book your 1-hour session:
    https://calendly.com/marcelnyiro

    What You'll Get:
    • 1-hour deep-dive session
    • Personalized business strategy review  
    • AI implementation roadmap
    • Investor pitch feedback & optimization
    • Access to exclusive network introductions
    • Follow-up email with key takeaways

    About Marcel:
    Founder of Outfino (AI fashion platform)
    Secured 73M HUF investment from OUVC
    Featured in Portfolio.hu and Growth Magazine

    Questions? Contact marcel@marcelnyiro.com

    Best regards,
    Marcel Nyirő
    AI Entrepreneur & Strategic Advisor

    Payment Reference: ${sessionId}
  `;

  return {
    subject,
    html: htmlContent,
    text: textContent
  };
}