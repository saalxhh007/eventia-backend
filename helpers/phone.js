// import venom from "venom-bot"

let client

function normalizeNum(phone) {
  let cleaned = phone.replace(/\D/g, "")

  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1)
  }
  if (!cleaned.startsWith('213')) {
    cleaned = '213' + cleaned
  }
  if (!/^213[5-7]\d{8}$/.test(cleaned)) {
    throw new Error(`Invalid Algerian phone number ${(cleaned)}`)
  }
  return cleaned
}

// async function sendWhatsAppVerification(phone, code) {
//   const client = await getClient();

//   const waId = phone.replace(/^\+/, '') + '@c.us';

//   const message = `Your BookStore verification code is: *${code}*`;

//   try {
//     await client.sendText(waId, message);
//   } catch (error) {
//     console.error('Failed to send WhatsApp message:', error);
//     throw new Error('WhatsApp message sending failed');
//   }
// }

async function getClient() {
  if (client) return client

  client = await venom.create({
    session: 'eventia-session',
    puppeteerOptions: { headless: true }
  })

  return client
}
export default { normalizeNum, sendWhatsAppVerification }
