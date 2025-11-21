import React, { useEffect, useState } from "react";
import MercadoPagoButton from "../components/MercadoPagoButton";

export default function PagoPrueba() {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/payments/create-preference", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        setPreferenceId(data.id);
      });
  }, []);

  return (
    <div>
      <h1>Pagar con Mercado Pago</h1>

      {preferenceId && <MercadoPagoButton preferenceId={preferenceId} />}
    </div>
  );
}
