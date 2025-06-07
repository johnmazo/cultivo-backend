// utils/twilio.js
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function enviarMensajeWhatsApp(to, mensaje) {
  try {
    const msg = await client.messages.create({
      body: mensaje,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${to}`
    });

    console.log('📩 Mensaje enviado:', msg.sid);
  } catch (error) {
    console.error('❌ Error al enviar mensaje WhatsApp:', error.message);
  }
}
