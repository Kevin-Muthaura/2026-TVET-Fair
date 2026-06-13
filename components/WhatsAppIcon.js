import { WHATSAPP_ICON_PATH } from '../lib/utils';

export default function WhatsAppIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: size, height: size, fill: 'white', flexShrink: 0 }}>
      <path d={WHATSAPP_ICON_PATH} />
    </svg>
  );
}
