import '../styles/globals.css'
// import { AppWrapper, useAppContext } from '../context/index';

import { loadStripe } from '@stripe/stripe-js'
import { CartProvider } from 'use-shopping-cart'
import { Grommet } from 'grommet';

function MyApp({ Component, pageProps }) {
  const stripePromise = loadStripe(process.env.STRIPE_API_PUBLIC)
  return (
    <Grommet>
      <CartProvider
        mode="checkout-session"
        stripe={stripePromise}
        successUrl="stripe.com"
        cancelUrl="twitter.com/picsoung"
        currency="USD"
        allowedCountries={['US', 'GB', 'CA']}
        billingAddressCollection={true}
      >
        <Component {...pageProps} />
      </CartProvider>
    </Grommet>
  )
}

export default MyApp
