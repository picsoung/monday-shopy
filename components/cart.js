import React, { useState } from 'react'
import { useShoppingCart,formatCurrencyString } from 'use-shopping-cart'
import { Cart, Close } from 'grommet-icons';
import { Stack, Box, Button, Text, Collapsible, Header, Heading } from 'grommet';
import { server, getConfig } from '../config';

import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe('pk_test_iJbUblwlJ2arJjZnlS015mQE');

export default function CartComponent() {
    const [openCart, setopenCart] = useState();
    const [status, setStatus] = useState('idle');

    const { totalPrice, cartDetails, redirectToCheckout, cartCount, clearCart } = useShoppingCart()

    const price = formatCurrencyString({
        value: totalPrice * 100,
        currency: 'USD',
        language: 'en-US'
    })

    async function handleClick(event) {
        const stripe = await stripePromise;

        event.preventDefault()
        if (cartCount > 0) {
            setStatus('idle')

            const response = await fetch(`${server}/api/checkout_sessions/cart`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cartDetails),
            })
                .then((res) => {
                    return res.json();
                })
                .catch((error) => console.log(error));

            console.log(response)
            const result = await stripe.redirectToCheckout({
                sessionId: response.sessionId,
            });
            console.log(result)

            // const error = await redirectToCheckout({ sessionId: response.sessionId });
            if (error) setStatus('redirect-error')
        } else {
            setStatus('missing-items')
        }
    }

    return (
        <>
            <Button
                icon={
                    <Stack anchor="top-right">
                        <Cart size="large" />
                        <Box
                            background="brand"
                            pad={{ horizontal: 'xsmall' }}
                            round
                        >
                            <Text>{cartCount}</Text>
                        </Box>
                    </Stack>
                }
                onClick={() => setopenCart(!openCart)}
            />
            <Collapsible direction="horizontal" open={openCart}>
                <Box width="medium" margin={{ top: 'xlarge' }} background={'white'} style={{ zIndex: 1000 }} pad="medium">
                    <Header height="xsmall">
                        <Heading>Cart</Heading>
                        <Box justify='end' >
                            <Button
                                icon={
                                    <Close size="small" />
                                }
                                onClick={() => setopenCart(!openCart)}
                            />
                        </Box>
                    </Header>
                    {/* Redirects the user to Stripe */}
                    <Box gap="small">
                        <Text>Number of items: {cartCount}</Text>
                        <Text>Total: {price}</Text>
                        {cartCount > 0 && (
                            <Box gap="small">
                                <Button primary onClick={handleClick} label="Checkout" />
                                <Button onClick={clearCart} label="Clear cart" />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Collapsible>
        </>
        // <article
        //   style={{
        //     display: 'flex',
        //     flexDirection: 'column',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //     width: '50%'
        //   }}
        // >
        //   {status === 'missing-items' && (
        //     <p>
        //       Your cart is empty. Please go to{' '}
        //       <Link to={'/usage/addItem()'}>addItem()</Link> and add an item to the
        //       cart
        //     </p>
        //   )}

        //   {status === 'redirect-error' && (
        //     <p>Unable to redirect to Stripe checkout page.</p>
        //   )}

        //   <button
        //     onClick={handleClick}
        //     style={{ height: 50, width: 100, marginBottom: 30 }}
        //   >
        //     Checkout
        //   </button>
        // </article>
    )
}