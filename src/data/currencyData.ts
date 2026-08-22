export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  ratePerInr: number; // e.g. 0.0118 for USD (meaning 1 INR = 0.0118 USD)
  inrPerUnit: number; // e.g. 84.75 INR = 1 USD
  formatLocale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    ratePerInr: 1.0,
    inrPerUnit: 1.0,
    formatLocale: "en-IN",
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    ratePerInr: 0.0118,
    inrPerUnit: 84.75,
    formatLocale: "en-US",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    ratePerInr: 0.0109,
    inrPerUnit: 91.80,
    formatLocale: "de-DE",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    ratePerInr: 0.0093,
    inrPerUnit: 107.50,
    formatLocale: "en-GB",
  },
  {
    code: "AED",
    name: "UAE Dirham",
    symbol: "AED",
    flag: "🇦🇪",
    ratePerInr: 0.0433,
    inrPerUnit: 23.08,
    formatLocale: "en-AE",
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    flag: "🇸🇬",
    ratePerInr: 0.0159,
    inrPerUnit: 62.90,
    formatLocale: "en-SG",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "CA$",
    flag: "🇨🇦",
    ratePerInr: 0.0163,
    inrPerUnit: 61.40,
    formatLocale: "en-CA",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "AU$",
    flag: "🇦🇺",
    ratePerInr: 0.0182,
    inrPerUnit: 54.95,
    formatLocale: "en-AU",
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "SAR",
    flag: "🇸🇦",
    ratePerInr: 0.0443,
    inrPerUnit: 22.58,
    formatLocale: "ar-SA",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    ratePerInr: 1.78,
    inrPerUnit: 0.56,
    formatLocale: "ja-JP",
  },
];

export function getCurrencyInfo(code: string = "INR"): CurrencyInfo {
  const found = SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found || SUPPORTED_CURRENCIES[0];
}

export function convertFromInr(amountInInr: number, targetCurrencyCode: string = "INR") {
  const currency = getCurrencyInfo(targetCurrencyCode);
  const converted = amountInInr * currency.ratePerInr;

  // Format with standard fraction digits
  const fractionDigits = currency.code === "JPY" ? 0 : 2;
  const formattedNumber = converted.toLocaleString(currency.formatLocale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  return {
    originalInr: amountInInr,
    convertedAmount: converted,
    formatted: `${currency.symbol} ${formattedNumber}`,
    currency,
  };
}
