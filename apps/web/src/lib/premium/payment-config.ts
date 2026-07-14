import fs from 'fs';
import path from 'path';
import { DEFAULT_PAYMENT_CONFIG, type PaymentConfig } from './payment-types';

const configPath = path.join(process.cwd(), 'src/data/payment-config.json');

export function readPaymentConfig(): PaymentConfig {
  try {
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(DEFAULT_PAYMENT_CONFIG, null, 2) + '\n', 'utf8');
      return DEFAULT_PAYMENT_CONFIG;
    }
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8')) as PaymentConfig;
    return {
      ...DEFAULT_PAYMENT_CONFIG,
      ...raw,
      methods: Array.isArray(raw.methods) && raw.methods.length ? raw.methods : DEFAULT_PAYMENT_CONFIG.methods,
      instructions:
        Array.isArray(raw.instructions) && raw.instructions.length
          ? raw.instructions
          : DEFAULT_PAYMENT_CONFIG.instructions,
    };
  } catch {
    return DEFAULT_PAYMENT_CONFIG;
  }
}

export function writePaymentConfig(config: PaymentConfig) {
  const next = { ...config, updated_at: new Date().toISOString() };
  fs.writeFileSync(configPath, JSON.stringify(next, null, 2) + '\n', 'utf8');
  return next;
}
