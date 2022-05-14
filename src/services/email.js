import Mailgun from 'mailgun-js'
import ServerError from '../errors/ServerError.js'

const MAILGUN_DOMAIN = 'sandbox61c636ffde654021982a80ede90c13d8.mailgun.org'

const mg = new Mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN
})

export default function getEmailService() {
  const sendConfirmationEmail = async (email, token) => {
    const data = {
      from: `noreply@${MAILGUN_DOMAIN}`,
      to: email,
      subject: 'Confirm your email',
      text: `Confirm your email by clicking on this link: ${process.env.BASE_URL}/api/v1/confirm?token=${token}`
    }
    try {
      return mg.messages().send(data)
    } catch (e) {
      console.log(e)
      throw new ServerError(500, e.message)
    }
  }

  return {
    sendConfirmationEmail
  }
}
