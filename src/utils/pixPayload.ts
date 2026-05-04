/**
 * PIX Payload Generation Utility
 * Based on Central Bank of Brazil (BCB) BR Code / EMV standard
 */

export function generatePixPayload({
  key,
  amount,
  name = 'LOJA',
  city = 'BRASIL',
  transactionId = '***',
}: {
  key: string;
  amount?: number;
  name?: string;
  city?: string;
  transactionId?: string;
}) {
  const formatId = (id: string, value: string) => {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  };

  // 00 - Payload Format Indicator
  let payload = formatId('00', '01');

  // 26 - Merchant Account Information
  const merchantInfo = formatId('00', 'BR.GOV.BCB.PIX') + formatId('01', key);
  payload += formatId('26', merchantInfo);

  // 52 - Merchant Category Code
  payload += formatId('52', '0000');

  // 53 - Transaction Currency (986 = BRL)
  payload += formatId('53', '986');

  // 54 - Transaction Amount
  if (amount && amount > 0) {
    payload += formatId('54', amount.toFixed(2));
  }

  // 58 - Country Code
  payload += formatId('58', 'BR');

  // 59 - Merchant Name (Removing spaces as per user request to ensure clean PIX code)
  const cleanName = name.trim().toUpperCase().replace(/\s+/g, '');
  payload += formatId('59', cleanName.substring(0, 25));

  // 60 - Merchant City (Removing spaces as per user request to ensure clean PIX code)
  const cleanCity = city.trim().toUpperCase().replace(/\s+/g, '');
  payload += formatId('60', cleanCity.substring(0, 15));

  // 62 - Additional Data Field
  const cleanTxId = transactionId
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  const additionalData = formatId('05', cleanTxId.substring(0, 25) || '***');
  payload += formatId('62', additionalData);

  // 63 - CRC16
  payload += '6304';
  payload += calculateCRC16(payload);

  return payload;
}

/**
 * CRC16 CCITT (0xFFFF) Implementation
 */
function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    const charCode = payload.charCodeAt(i);
    crc ^= charCode << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
  }

  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}
