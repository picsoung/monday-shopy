import Head from 'next/head'
import styles from '../styles/Home.module.css'

import React, { useContext, useState } from "react"

import { server, getConfig } from '../config';
import Link from 'next/link'
import { useAppContext } from "../context";

import { useShoppingCart } from 'use-shopping-cart'
import { Box, Grommet, Heading, Nav, Anchor,Sidebar, Footer, Text } from 'grommet';
import Layout from '../components/layout';
import { Product } from '../components/product.js'

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.STRIPE_API_PUBLIC);

export async function getServerSideProps(context) {
  //get products
  const res = await fetch(`${server}/api/products`)
  const data = await res.json()
  let products = []

  if (data && data.products) {
    products = data.products
  }

  let categories = products.map((p) => p.category)
  categories = [...new Set(categories)]

  let configDetails = getConfig()

  return {
    props: {
      products,
      categories,
      configDetails
    }
  }
}

export default function Home({ products, categories, configDetails }) {
  const state = useAppContext();
  const [status, setStatus] = useState('idle')
  const { totalPrice, cartDetails, redirectToCheckout, cartCount, clearCart } = useShoppingCart()

  const [websiteName, setWebsiteName] = useState(configDetails.websiteName)
  const [bgColor, setBgColor] = useState(configDetails.bgColor)
  const [currency, setCurrency] = useState(configDetails.currency)

  if (products) {
    state.products = products
  }
  if (categories) {
    state.categories = categories
  }

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
    <Layout siteName={websiteName}>
      <Box
        justify="center"
        align="center"
        direction="column"
        fill={true}
      >
        <Box direction="row" gap="small" margin={{ top: 'small' }}>
          <Anchor href="/" label="All" />
          {categories && categories.map((cat) => (
            <Anchor href={`/c/${cat}`} label={cat} key={cat}/>
          ))}
          {/* </Nav> */}
        </Box>
        <Box direction="row">
          {products && products.map((product) => (
            <Product key={product.id} product={product} currency={currency}/>
          ))}
        </Box>
      </Box>
    </Layout>
  )
}