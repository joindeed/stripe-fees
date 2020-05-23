import calculateStripeFee, { _calculateFees } from '../src/stripe-fees'

test('0 amount yields 0 fee', () => {
  expect(calculateStripeFee(0, 'GB', 'GB', 0)).toBe(0)
})

test('Integrational GB => US', () => {
  expect(calculateStripeFee(100, 'US', 'GB', 0)).toBe(4.370447450572328)
})

test('Integrational US => GB', () => {
  expect(calculateStripeFee(100, 'GB', 'US', 0)).toBe(5.467928496319672)
})

test('US => US', () => {
  expect(_calculateFees('US', 'US')).toEqual({
    fixedFee: 0.3,
    percentFee: 2.9,
    currencyConversionPercentFee: 0,
    isDomesticCard: true,
    isSameCurrency: true
  })
})

test('GB => GB', () => {
  expect(_calculateFees('GB', 'GB')).toEqual({
    fixedFee: 0.3,
    percentFee: 1.4,
    currencyConversionPercentFee: 0,
    isDomesticCard: true,
    isSameCurrency: true
  })
})
test('US => GB', () => {
  expect(_calculateFees('GB', 'US')).toEqual({
    fixedFee: 0.3,
    percentFee: 4.9,
    currencyConversionPercentFee: 2,
    isDomesticCard: false,
    isSameCurrency: false
  })
})
test('GB => US', () => {
  expect(_calculateFees('US', 'GB')).toEqual({
    fixedFee: 0.3,
    percentFee: 3.9,
    currencyConversionPercentFee: 1,
    isDomesticCard: false,
    isSameCurrency: false
  })
})

test('LU => IE: two EuroZone countries', () => {
  expect(_calculateFees('IE', 'LU')).toEqual({
    fixedFee: 0.25,
    percentFee: 1.4,
    currencyConversionPercentFee: 0,
    isDomesticCard: true,
    isSameCurrency: true
  })
})

test('GB => DK: two non-EuroZone European countries', () => {
  expect(_calculateFees('DK', 'GB')).toEqual({
    fixedFee: 1.8,
    percentFee: 3.4,
    currencyConversionPercentFee: 2,
    isDomesticCard: true,
    isSameCurrency: false
  })
})
