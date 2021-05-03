const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:3000' : 'https://shopy.vercel.app';

export const getConfig = () =>{
    let CURRENCY = {
        USD: '$',
        EUR: '€',
        GBP: '£'
    }
    return {
        websiteName: process.env.WEBSITE_NAME,
        bgColor: process.env.BACKGROUND_COLOR,
        currency: process.env.CURRENCY,
        currencySymbol: CURRENCY[process.env.CURRENCY]
    }
}