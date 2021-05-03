import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

//get all products from a category
import { useAppContext } from "../../../context";
import { server } from '../../../config';
const Category = () => {
    const router = useRouter()
    const { category } = router.query
    const state = useAppContext();
    const [products, setProducts] = useState([])

    useEffect(async () => {
        if(!router.isReady) return;
        if (!state.products) {
            let allProducts = await loadProduct()
            let categories = allProducts.map((p) => p.category)
            categories = [...new Set(categories)]

            if (products) {
                state.products = allProducts
            }
            if (categories) {
                state.categories = categories
            }
        }
        setProducts(state.products.filter((p)=> p.category === category))
    }, [router.isReady]);

    // console.log('state', state)
    // if (!state.products) {
    //     loadProduct()
    // }else{
    //     //filter product by category
    //     products = state.products.map((p) => p.category === category)
    // }

    return (
        <div>
            <p>Categ: {category}</p>
            {products.map((product) => (
                <Product
                    key={product.name}
                    name={product.name}
                    type={product.type}
                    images={product.images}
                    price={product.price}
                />
            ))}
        </div>
    )
}

const loadProduct = async () => {
    const res = await fetch(`${server}/api/products`)
    const data = await res.json()
    let products = []

    console.log('data', data)

    if (data && data.products) {
        products = data.products
    }
    return products
}

function Product({ name, type, images, price }) {
    return (    
        <div style={{ padding: '32px' }}>
            <div>
                <b>{name}</b>
            </div>
            <div>{type}</div>
            {images && images.map((image) => (
                <img style={{ maxWidth: 200 }} key={image} src={image} alt={name} />
            ))}
            <div>${price}</div>
            <button onClick="">Buy now</button>
        </div>
    );
}

export default Category