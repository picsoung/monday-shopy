import { NextApiRequest, NextApiResponse } from 'next'

/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */
import { validateCartItems } from 'use-shopping-cart/src/serverUtil'
import { server } from '../../../config';

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_API_SECRET, {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2020-03-02',
})

export default async function handler(
    req,
    res
) {
    if (req.method === 'POST') {
        try {
            console.log(req.body)
            // Validate the cart details that were sent from the client.
            const cartItems = req.body

            //get inventory
            const productCall = await fetch(`${server}/api/products`)
            const productData = await productCall.json()
            
            // add currency
            productData.products.map((p)=> {
                p.currency = "USD"
                p.price = parseFloat(p.price*100)
                p.image = p.images[0]
                return p
            })

            const line_items = validateCartItems(productData.products, cartItems)
            console.log('line items', line_items)
            // Create Checkout Sessions from body params.
            const params = {
                submit_type: 'pay',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_address_collection: {
                    allowed_countries: ['US', 'CA'],
                },
                line_items,
                mode: 'payment',
                success_url: `${req.headers.origin}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/`,
            }
            const checkoutSession = await stripe.checkout.sessions.create(
                params
            )

            res.status(200).json({ sessionId: checkoutSession.id })
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message })
        }
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method Not Allowed')
    }
}