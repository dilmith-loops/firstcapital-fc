import net from "node:net";
import tls from "node:tls";

interface LeadNotificationData {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string | undefined;
  profileKey?: string | undefined;
  resultCode?: string | undefined;
  profileName?: string | undefined;
  resultProfile?: string | undefined;
  matchedProduct?: string | undefined;
  answers?: Record<number, string> | undefined;
  source?: string | undefined;
}

const DEFAULT_QUESTIONS: Record<number, { question: string; options: Record<string, string> }> = {
  1: {
    question: "You have some extra money sitting in your account. What’s your first thought?",
    options: {
      A: "I’d keep it somewhere safe, but I want to be able to access it anytime.",
      B: "I’m happy to leave it invested for a few months if I can earn a return.",
      C: "I’m comfortable leaving it invested for longer if it can grow steadily.",
      D: "I’d rather invest for the potential of higher long-term growth",
    },
  },
  2: {
    question: "How long can you comfortably leave your money invested?",
    options: {
      A: "1 - 6 months",
      B: "6 months – 1 year",
      C: "1–2 years",
      D: "More than 2 years",
    },
  },
  3: {
    question: "Interest rates in the market move up and down frequently. What is your reaction?",
    options: {
      A: "I’d probably want to take my money out.",
      B: "A little movement is fine, but I prefer stability.",
      C: "I can handle some ups and downs if I have a longer-term plan.",
      D: "I’m comfortable with bigger ups and downs for the chance of higher growth.",
    },
  },
  4: {
    question: "What is your priority for investing right now?",
    options: {
      A: "A financial safety net",
      B: "A goal coming up in the next year or so",
      C: "A bigger milestone in the next few years",
      D: "Long-term wealth and financial freedom",
    },
  },
  5: {
    question: "What would you say is your pattern for investing?",
    options: {
      A: "Setting aside an amount every month",
      B: "Investing when I have some extra money",
      C: "Investing a large amount at once and letting it work",
      D: "Investing when I spot an opportunity I believe in",
    },
  },
  6: {
    question: "Imagine you have LKR 500,000 ready to invest. Which sounds like you?",
    options: {
      A: "Keep it flexible and invest for the short term.",
      B: "Aim for a relatively stable return while keeping access to my money.",
      C: "Lock it into a longer-term government investment and earn regular interest.",
      D: "Invest in shares and stay invested for long-term growth.",
    },
  },
  7: {
    question: "Which statement sounds most like you?",
    options: {
      A: "“I like knowing my money is there when I need it.”",
      B: "“I want my money to grow, without taking on too much risk.”",
      C: "“I’m happy to wait if it means building my money for the potential of long-term growth.”",
      D: "“I’m playing the long game when it comes to my wealth.”",
    },
  },
};

export async function sendNodeSmtpNotification(lead: LeadNotificationData): Promise<boolean> {
  const isEnabled = process.env["SMTP_ENABLED"] !== "false" && process.env["SMTP_ENABLED"] !== "0";
  const host = (process.env["SMTP_HOST"] || "").trim();
  const port = parseInt(process.env["SMTP_PORT"] || "465", 10);
  const secure = (process.env["SMTP_SECURE"] || (port === 465 ? "ssl" : "tls")).toLowerCase();
  const user = (process.env["SMTP_USER"] || "").trim();
  const pass = (process.env["SMTP_PASS"] || process.env["SMTP_PASSWORD"] || "").trim();
  const fromEmail = (process.env["SMTP_FROM_EMAIL"] || user || "no-reply@firstcapital.lk").trim();
  const fromName = (process.env["SMTP_FROM_NAME"] || "First Capital Investor Week").trim();
  const toEmail = (process.env["ADMIN_EMAIL"] || process.env["SMTP_TO_EMAIL"] || "").trim();

  if (!isEnabled || !host || !toEmail || pass === "your_smtp_password_here") {
    return false;
  }

  const name = lead.name || "Anonymous Investor";
  const email = lead.email || "N/A";
  const phone = lead.phone || "N/A";
  const gender = lead.gender || "male";
  const profileCode = (lead.resultCode || lead.profileKey || "A").toUpperCase();
  const profileName = lead.resultProfile || lead.profileName || "Investor";
  const matchedProduct = lead.matchedProduct || "First Capital Investment Fund";
  const source = lead.source || "Landing Page Quiz";
  const date = new Date().toISOString().replace("T", " ").substring(0, 19);

  let answersHtml = "";
  for (let i = 1; i <= 7; i++) {
    const userKey = (lead.answers?.[i] || "N/A").toUpperCase();
    const q = DEFAULT_QUESTIONS[i];
    const qText = q?.question || `Question ${i}`;
    const optText = q?.options?.[userKey] || "No answer provided";

    answersHtml += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px 12px; font-weight: 700; color: #1a214c; width: 45px; vertical-align: top;">Q${i}</td>
        <td style="padding: 10px 12px; color: #334155;">
          <div style="font-weight: 600; font-size: 13px; color: #0f172a; margin-bottom: 4px;">${qText}</div>
          <div style="font-size: 13px; background: #f8fafc; border-left: 3px solid #f1ca1f; padding: 6px 10px; border-radius: 4px;">
            <strong style="color: #1a214c;">[Option ${userKey}]</strong> ${optText}
          </div>
        </td>
      </tr>`;
  }

  const subject = `🎯 New Investor Quiz Lead: ${name} (${profileName}) - Ref: ${lead.id}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; background: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; color: #1e293b;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 0;">
        <tr><td align="center">
          <table width="620" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.06);">
            <!-- Header Banner -->
            <tr>
              <td style="background-color: #1a214c; padding: 24px 28px; border-bottom: 4px solid #f1ca1f;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 1.5px; color: #f1ca1f; margin-bottom: 4px;">First Capital Investor Week</div>
                      <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">New Investor Quiz Submission</h1>
                    </td>
                    <td align="right" style="vertical-align: middle;">
                      <span style="background: #f1ca1f; color: #1a214c; font-weight: 800; font-size: 12px; padding: 6px 12px; border-radius: 20px; text-transform: uppercase;">${lead.id}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 28px 10px 28px;">
                <div style="background: #1a214c; border-radius: 12px; padding: 18px; color: #ffffff;">
                  <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #f1ca1f;">Final Quiz Result</div>
                  <h2 style="margin: 4px 0 8px 0; font-size: 20px; font-weight: 800; color: #ffffff;">${profileName}</h2>
                  <div style="font-size: 13px; color: #e2e8f0; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px;">
                    <strong style="color: #ffffff;">Suggested Match:</strong> ${matchedProduct}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 28px;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 800; color: #1a214c; text-transform: uppercase;">Investor Contact Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px;">
                  <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 12px; font-weight: 700; color: #475569; width: 140px;">Full Name</td>
                    <td style="padding: 8px 12px; font-weight: 700; color: #0f172a;">${name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 12px; font-weight: 700; color: #475569;">Email Address</td>
                    <td style="padding: 8px 12px;"><a href="mailto:${email}" style="color: #1a214c; font-weight: 600;">${email}</a></td>
                  </tr>
                  <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 12px; font-weight: 700; color: #475569;">Phone Number</td>
                    <td style="padding: 8px 12px;"><a href="tel:${phone}" style="color: #1a214c; font-weight: 700;">${phone}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 8px 12px; font-weight: 700; color: #475569;">Gender</td>
                    <td style="padding: 8px 12px;">${gender}</td>
                  </tr>
                  <tr style="background: #f8fafc;">
                    <td style="padding: 8px 12px; font-weight: 700; color: #475569;">Submitted At</td>
                    <td style="padding: 8px 12px; color: #64748b;">${date}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 28px 24px 28px;">
                <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 800; color: #1a214c; text-transform: uppercase;">Quiz Answers (7 Questions)</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px;">
                  ${answersHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="background: #f8fafc; padding: 16px 28px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
                Sent automatically by First Capital Investor Week lead capture.
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  return new Promise((resolve) => {
    try {
      const boundary = `----=_Part_${Date.now()}`;
      const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
      const encodedFromName = `=?UTF-8?B?${Buffer.from(fromName).toString("base64")}?=`;

      const headers = [
        `From: ${encodedFromName} <${fromEmail}>`,
        `To: <${toEmail}>`,
        email && email.includes("@") ? `Reply-To: <${email}>` : null,
        `Subject: ${encodedSubject}`,
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ].filter(Boolean);

      const rawEmail =
        headers.join("\r\n") +
        "\r\n\r\n" +
        `--${boundary}\r\n` +
        "Content-Type: text/html; charset=UTF-8\r\n" +
        "Content-Transfer-Encoding: base64\r\n\r\n" +
        Buffer.from(htmlBody).toString("base64") +
        "\r\n" +
        `--${boundary}--\r\n`;

      const socket: net.Socket =
        secure === "ssl"
          ? tls.connect({ host, port, rejectUnauthorized: false })
          : net.connect({ host, port });

      let step = 0;
      socket.on("data", (data: Buffer | string) => {
          const str = data.toString();
          if (step === 0 && str.startsWith("220")) {
            step++;
            socket.write(`EHLO firstcapital.lk\r\n`);
          } else if (step === 1 && str.startsWith("250")) {
            step++;
            if (user) {
              socket.write(`AUTH LOGIN\r\n`);
            } else {
              socket.write(`MAIL FROM:<${fromEmail}>\r\n`);
              step = 4;
            }
          } else if (step === 2 && str.startsWith("334")) {
            step++;
            socket.write(Buffer.from(user).toString("base64") + "\r\n");
          } else if (step === 3 && str.startsWith("334")) {
            step++;
            socket.write(Buffer.from(pass).toString("base64") + "\r\n");
          } else if (step === 4 && (str.startsWith("235") || str.startsWith("250"))) {
            step++;
            socket.write(`MAIL FROM:<${fromEmail}>\r\n`);
          } else if (step === 5 && str.startsWith("250")) {
            step++;
            socket.write(`RCPT TO:<${toEmail}>\r\n`);
          } else if (step === 6 && str.startsWith("250")) {
            step++;
            socket.write("DATA\r\n");
          } else if (step === 7 && str.startsWith("354")) {
            step++;
            socket.write(rawEmail + "\r\n.\r\n");
          } else if (step === 8 && str.startsWith("250")) {
            step++;
            socket.write("QUIT\r\n");
            socket.end();
            resolve(true);
          }
        });

      socket.setTimeout(15000, () => {
        socket.destroy();
        resolve(false);
      });

      socket.on("error", () => {
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}
