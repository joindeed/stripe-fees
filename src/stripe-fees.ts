const europeanCountryCodes = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'GB'
]

const euroZoneCountryCodes = [
  'AT',
  'BE',
  'CY',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PT',
  'SK',
  'SI',
  'ES'
]

interface FeeInformation {
  fixedFeeDomestic: number
  percentFeeDomestic: number
  fixedFeeInternational: number
  percentFeeInternational: number
  currencyConversionPercentFee: number
}
interface FeesByCountry {
  [countryCode: string]: FeeInformation | undefined
}

// Add more Stripe countries to this list according to
// https://stripe.com/{countryCode}/pricing#pricing-details
const stripeFeesByCountry: FeesByCountry = {
  US: {
    fixedFeeDomestic: 0.3,
    percentFeeDomestic: 2.9,
    fixedFeeInternational: 0.3,
    percentFeeInternational: 2.9,
    currencyConversionPercentFee: 1
  },
  GB: {
    fixedFeeDomestic: 0.3,
    percentFeeDomestic: 1.4,
    fixedFeeInternational: 0.3,
    percentFeeInternational: 2.9,
    currencyConversionPercentFee: 2
  },
  DK: {
    fixedFeeDomestic: 1.8,
    percentFeeDomestic: 1.4,
    fixedFeeInternational: 1.8,
    percentFeeInternational: 2.9,
    currencyConversionPercentFee: 2
  },
  IE: {
    fixedFeeDomestic: 0.25,
    percentFeeDomestic: 1.4,
    fixedFeeInternational: 0.25,
    percentFeeInternational: 2.9,
    currencyConversionPercentFee: 2
  },
  LU: {
    fixedFeeDomestic: 0.25,
    percentFeeDomestic: 1.4,
    fixedFeeInternational: 0.25,
    percentFeeInternational: 2.9,
    currencyConversionPercentFee: 2
  },
  IN: {
    fixedFeeDomestic: 0,
    // @TODO: Actually it's more complicated than that https://stripe.com/en-in/pricing#pricing-details
    percentFeeDomestic: 2,
    fixedFeeInternational: 0,
    percentFeeInternational: 4.3,
    currencyConversionPercentFee: 2
  },
  JP: {
    fixedFeeDomestic: 0,
    percentFeeDomestic: 3.6,
    fixedFeeInternational: 0,
    percentFeeInternational: 3.6,
    currencyConversionPercentFee: 2
  },
  SG: {
    fixedFeeDomestic: 0.5,
    percentFeeDomestic: 3.4,
    fixedFeeInternational: 0.5,
    percentFeeInternational: 3.4,
    currencyConversionPercentFee: 2
  }
}

// Exposed for the sake of testing
export const _calculateFees = (accountCountryCode: string, cardCountryCode: string) => {
  const accountCountryInformation = stripeFeesByCountry[accountCountryCode]
  if (!accountCountryInformation) {
    throw new Error(`Given country code "${accountCountryCode}" is not supported by Stripe`)
  }
  const isDomesticCard =
    accountCountryCode === cardCountryCode ||
    (europeanCountryCodes.includes(accountCountryCode) &&
      europeanCountryCodes.includes(cardCountryCode))
  const fixedFee = isDomesticCard
    ? accountCountryInformation.fixedFeeDomestic
    : accountCountryInformation.fixedFeeInternational
  const isSameCurrency =
    // Here we are making a rough assumption that the card's currency is the same as its country's national currency, but it's the best we can do
    cardCountryCode === accountCountryCode ||
    // Bot countries are from Euro-zone
    (euroZoneCountryCodes.includes(accountCountryCode) &&
      euroZoneCountryCodes.includes(cardCountryCode))
  const currencyConversionPercentFee = isSameCurrency
    ? 0
    : accountCountryInformation.currencyConversionPercentFee
  const percentFee =
    currencyConversionPercentFee +
    (isDomesticCard
      ? accountCountryInformation.percentFeeDomestic
      : accountCountryInformation.percentFeeInternational)
  return { isDomesticCard, isSameCurrency, currencyConversionPercentFee, fixedFee, percentFee }
}

const calculateStripeFee = (
  amount: number,
  accountCountryCode: string,
  cardCountryCode: string,
  applicationFee: number = 0
) => {
  if (!amount) {
    return 0
  }
  const result = _calculateFees(accountCountryCode, cardCountryCode)
  return (amount + result.fixedFee) / (1 - result.percentFee / 100 - applicationFee / 100) - amount
}

export default calculateStripeFee
