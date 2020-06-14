# stripe-fees

> Calculate Stripe fees for international and domestic transactions

Often times you would wish to make your customers know the transaction fee before making the transaction (e.g. if you want to ask the customer to cover the fees).

Unfortunately Stripe does not provide any API for that :-(

But this mighty little package is here to help!

## Installation

```
yarn add stripe-fees
```

## Usage

**Heads up!** All currency amounts are in cents (1/100)!

```js
calculateStripeFee(
  // Transaction amount in cents
  amount: number,
  // Alpha-2 country code of the target account
  accountCountryCode: string,
  // Bank card Alpha-2 country code
  cardCountryCode: string,
  // Your applicationFee in percents, default to 0
  applicationFee: number = 0
): number // Returns resulting fee amount in cents
```

E.g. transaction from UK card to US account:

```js
import calculateStripeFee from 'stripe-fees'
const stripeFee = calculateStripeFee(100, 'US', 'UK')
```

But now you are left wondering, how to get the card country code from the Strip card input element before making the transaction (since it's protected from direct access)? Simple!

```js
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const YourCardInputComponent = ({ setCardCountryCode }) => {
  const elements = useElements()
  const stripe = useStripe()

  return (
    <CardElement
      onChange={ev => {
        if (ev.complete) {
          const card = elements?.getElement(CardElement)
          if (card) {
            stripe
              ?.createPaymentMethod({
                type: 'card',
                card
              })
              .then(response => {
                const countryCode = response?.paymentMethod?.card?.country
                if (countryCode) {
                  setCardCountryCode(countryCode)
                }
              })
          }
        }
      }}
    />
  )
}
```

## Contribute

Not all countries are yet supported. Add more to `stripeFeesByCountry` according to https://stripe.com/{countryCode}/pricing#pricing-details and provide a PR!

## A note to Stripe

If you guys are reading it, please make an official API for this stuff! Your fees are hard to calculate by hand, really!

## Credit

This package has been proudly developed by the Deed team!

Check us out, we may be hiring!

https://www.joindeed.com/
