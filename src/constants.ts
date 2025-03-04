import Ably from "ably";
import { v4 as uuidv4 } from "uuid";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const clientId = uuidv4();
export const realtime = new Ably.Realtime({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  clientId: clientId,
});
