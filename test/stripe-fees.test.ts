import calculateStripeFee, { _calculateFees } from '../src/stripe-fees'

test('Throws on bad country code', () => {
  expect(() => calculateStripeFee(10, 'ZZ', 'ZZ')).toThrow(
    'Given country code "ZZ" is not supported by Stripe'
  )
})

test('0 amount yields 0 fee', () => {
  expect(calculateStripeFee(0, 'GB', 'GB', 0)).toEqual({
    totalFeeAmount: 0,
    applicationFeeAmount: 0,
    providerFeeAmount: 0
  })
})

test('Integrational GB => US', () => {
  expect(calculateStripeFee(10000, 'US', 'GB', 0)).toEqual({
    applicationFeeAmount: 0,
    providerFeeAmount: 437,
    totalFeeAmount: 437
  })
})
test('Integrational GB => US, don\t cover fees', () => {
  expect(calculateStripeFee(10000, 'US', 'GB', 0, false)).toEqual({
    applicationFeeAmount: 0,
    providerFeeAmount: 420,
    totalFeeAmount: 420
  })
})

test('Integrational US => GB', () => {
  expect(calculateStripeFee(10000, 'GB', 'US', 0)).toEqual({
    applicationFeeAmount: 0,
    providerFeeAmount: 547,
    totalFeeAmount: 547
  })
})
test('Integrational US => GB, don\t cover fees', () => {
  expect(calculateStripeFee(10000, 'GB', 'US', 0, false)).toEqual({
    applicationFeeAmount: 0,
    providerFeeAmount: 520,
    totalFeeAmount: 520
  })
})

test('US => US', () => {
  expect(_calculateFees('US', 'US')).toEqual({
    fixedFee: 30,
    percentFee: 2.9,
    currencyConversionPercentFee: 0,
    isDomesticCard: true,
    isSameCurrency: true
  })
})

test('GB => GB', () => {
  expect(_calculateFees('GB', 'GB')).toEqual({
    fixedFee: 30,
    percentFee: 1.4,
    currencyConversionPercentFee: 0,
    isDomesticCard: true,
    isSameCurrency: true
  })
})
test('US => GB', () => {
  expect(_calculateFees('GB', 'US')).toEqual({
    fixedFee: 30,
    percentFee: 4.9,
    currencyConversionPercentFee: 2,
    isDomesticCard: false,
    isSameCurrency: false
  })
})
test('GB => US', () => {
  expect(_calculateFees('US', 'GB')).toEqual({
    fixedFee: 30,
    percentFee: 3.9,
    currencyConversionPercentFee: 1,
    isDomesticCard: false,
    isSameCurrency: false
  })
})

test('LU => IE: two EuroZone countries', () => {
  expect(_calculateFees('IE', 'LU')).toEqual({
    fixedFee: 25,
    percentFee: 1.4,
    currencyConversionPercentFee: 0,
    isDomesticCard: true,
    isSameCurrency: true
  })
})

test('GB => DK: two non-EuroZone European countries', () => {
  expect(_calculateFees('DK', 'GB')).toEqual({
    fixedFee: 180,
    percentFee: 3.4,
    currencyConversionPercentFee: 2,
    isDomesticCard: true,
    isSameCurrency: false
  })
})
