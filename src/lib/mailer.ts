import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

let mailerSend: MailerSend | undefined;

function getMailerSend(): MailerSend | null {
  const apiKey = process.env.MAILERSEND_API_KEY;
  if (!apiKey) return null;

  if (!mailerSend) {
    mailerSend = new MailerSend({ apiKey });
  }
  return mailerSend;
}

interface ContactNotificationInput {
  name: string;
  email: string;
  message: string;
}

/**
 * Best-effort notification: a failure here must never fail the contact form
 * submission, since the message is already persisted in the database and
 * visible in the admin panel regardless of email delivery.
 */
export async function sendContactNotification(
  input: ContactNotificationInput
): Promise<void> {
  const client = getMailerSend();
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL;
  const toEmail = process.env.MAILERSEND_TO_EMAIL;

  if (!client || !fromEmail || !toEmail) return;

  const params = new EmailParams()
    .setFrom(new Sender(fromEmail, "Portfolyo İletişim Formu"))
    .setTo([new Recipient(toEmail)])
    .setReplyTo(new Recipient(input.email, input.name))
    .setSubject(`Yeni iletişim formu mesajı — ${input.name}`)
    .setHtml(
      `<p><strong>Ad:</strong> ${escapeHtml(input.name)}</p>
       <p><strong>E-posta:</strong> ${escapeHtml(input.email)}</p>
       <p><strong>Mesaj:</strong></p>
       <p>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>`
    )
    .setText(
      `Ad: ${input.name}\nE-posta: ${input.email}\n\nMesaj:\n${input.message}`
    );

  try {
    await client.email.send(params);
  } catch (error) {
    console.error("MailerSend notification failed:", error);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
