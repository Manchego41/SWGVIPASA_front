import React from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

// En VITE usamos import.meta.env
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);

export default function MercadoPagoButton({ preferenceId }) {
  return <Wallet initialization={{ preferenceId }} />;
}
