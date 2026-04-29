import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generatePixPayload } from '../utils/pixPayload';
import QRCode from 'qrcode';

export function usePixGenerator() {
  const [generating, setGenerating] = useState(false);

  const generate = async (config: any, amount: number) => {
    setGenerating(true);
    try {
      const payload = generatePixPayload({
        key: config.chave_pix,
        amount,
        name: config.merchant_name,
        city: config.merchant_city,
        transactionId: config.identificador,
      });

      const qrCodeUrl = await QRCode.toDataURL(payload, {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: { dark: '#0f172a', light: '#ffffff' },
      });

      // Log transaction
      await addDoc(collection(db, 'transactions'), {
        payload,
        amount,
        identificador: config.identificador,
        timestamp: serverTimestamp(),
      });

      return { payload, qrCodeUrl };
    } finally {
      setGenerating(false);
    }
  };

  return { generate, generating };
}
