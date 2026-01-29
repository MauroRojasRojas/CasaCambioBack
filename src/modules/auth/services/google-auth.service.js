import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../../core/errors/app-error.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
      email: payload.email,
      googleId: payload.sub,
      nombres: payload.given_name,
      apellidos: payload.family_name
    };

  } catch (error) {
    console.error('Google token error:', error.message);

    // ⛔ Cualquier otro error
    throw new AppError(
      'Error al validar Google Sign-In',
      401,
      'GOOGLE_AUTH_FAILED'
    );
  }
}