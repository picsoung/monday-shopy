import { useShoppingCart, formatCurrencyString } from 'use-shopping-cart'
import {
    Anchor,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    Collapsible,
    Heading,
    Grommet,
    Image,
    Paragraph,
} from 'grommet';

import { Cart } from 'grommet-icons';


export function Product({ product, currency }) {
    const { addItem } = useShoppingCart()

    /* A helper function that turns the price into a readable format */
    const price = formatCurrencyString({
        value: product.price * 100,
        currency: currency || 'USD',
        language: 'en-US'
    })
    return (
        <Box pad="medium" align="start" direction="column">
            <Card elevation="large" width="medium" justify="center">
                <Image
                    fit="cover"
                    src={product.images[0]}
                    a11yTitle={`${product.name}`}
                />
            </Card>
            <Box pad={{ horizontal: 'medium' }} responsive={false}>
                <Heading level="3" margin={{ vertical: 'medium' }}>
                    {product.name}
                </Heading>
                <Paragraph margin={{ top: 'none' }}>
                    {product.description}
                </Paragraph>
            </Box>
            <CardFooter pad={{ horizontal: 'medium' }}>
                <Box direction="row" align="center" gap="small">
                    <Heading level="3" margin={{ vertical: 'medium' }}>{price}</Heading>
                    <Button icon={<Cart color="plain" />} onClick={() => addItem(product)} label="Buy now" />
                </Box>
            </CardFooter>
        </Box>
        //   <article
        //     style={{
        //       display: 'flex',
        //       flexDirection: 'column',
        //       justifyContent: 'center',
        //       alignItems: 'center',
        //       width: '50%'
        //     }}
        //   >
        //     <figure style={{ textAlign: 'center' }}>
        //       <img
        //         style={{ height: 200 }}
        //         src={product.images[0]}
        //         alt={` ${product.name}`}
        //       />
        //       <figcaption>{product.name}</figcaption>
        //     </figure>
        //     <p>{price}</p>
        //     {/* Adds the item to the cart */}
        //     <section
        //       style={{
        //         display: 'flex',
        //         justifyContent: 'space-evenly',
        //         width: '100%'
        //       }}
        //     >
        //       <button
        //         onClick={() => addItem(product)}
        //         aria-label={`Add ${product.name} to your cart`}
        //         style={{ height: 50, width: 100, marginBottom: 30 }}
        //       >
        //         Add to cart
        //       </button>
        //       <button
        //         onClick={() => addItem(product, 10)}
        //         aria-label={`Add 10 ${product.name} to your cart`}
        //         style={{ height: 50, width: 100, marginBottom: 30 }}
        //       >
        //         Add 10 to cart
        //       </button>
        //     </section>
        //   </article>
    )
}