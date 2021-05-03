// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')(process.env.STRIPE_API_SECRET);

// Find your endpoint's secret in your Dashboard's webhook settings
const endpointSecret = process.env.WEBHOOK_SECRET;
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN)

const fulfillOrder = async (session) => {
    console.log("Fulfilling order", session);

    // get all boards
    let boards = await monday.api('query { boards { id, name } }')
    console.log('boards',boards)

    let productBoard = boards.data.boards.find((b) => b.name === 'Products')
    let productsRequest = await monday.api(`query { boards(ids: [${productBoard.id}]) {
        items {
          id,
          name
        }
      } }`)


    // find Order Board
    let ordersBoard = boards.data.boards.find((b) => b.name === 'Orders')
    // find Customer board
    let customersBoard = boards.data.boards.find((b) => b.name === 'Customers')
    console.log("customerBoard", customersBoard)

    // add customer
    let customer = {
        'email': {email: session.customer_details.email, text:session.customer_details.email},
        'long_text': `${session.shipping.address.line1}, ${session.shipping.address.line2}`, //address
        'text': session.shipping.address.city, //city
        'text3': session.shipping.address.country, //country
        'text5': session.shipping.address.postal_code //postal code
    }
    let newCustomer = await monday.api(`mutation {
        create_item (board_id: ${customersBoard.id}, item_name: "${session.shipping.name}", column_values: ${JSON.stringify(JSON.stringify(customer))}) {
          id
          }}`).then((result) => {
        console.log('result', result)
        return result
    }).catch((err) => {
        console.log('errr', err)
    })
    console.log('newCustomer',newCustomer, newCustomer.data)


    //get line items from session
    let lineItems = await stripe.checkout.sessions.listLineItems(session.id,{ limit: 5 });

    let productIds = lineItems.data.map((l)=>{
        let product = productsRequest.data.boards[0].items.find((p)=> p.name === l.description)
        if(product){
            return parseInt(product.id)
        }
    })

    console.log('productIds',productIds)

    let order = {
        'numbers': session.amount_total/100,
        'status8': {label: 'Received'}, //status
        'connect_boards': {item_ids:productIds}, //product
        'link_to_customers': {item_ids:[parseInt(newCustomer.data.create_item.id)]}, //customer
        'numbers5': lineItems.data.length //nb items
    }
    console.log(order)
    console.log(`mutation {
        create_item (board_id: ${ordersBoard.id}, item_name: "${session.id}", column_values: ${JSON.stringify(JSON.stringify(order))}) {
          id
          }}`)
    let newOrder = monday.api(`mutation {
        create_item (board_id: ${ordersBoard.id}, item_name: "${session.id}", column_values: ${JSON.stringify(JSON.stringify(order))}) {
          id
          }}`).then((result) => {
        console.log('result', result)
        return result
    }).catch((err) => {
        console.log('errr', err)
    })
    // add order
}

export default async (req, res) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    // console.log('webhook', payload)
    let event;

    // try {
    //     event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    // } catch (err) {
    //     return res.status(400).send(`Webhook Error: ${err.message}`);
    // }

    // Handle the checkout.session.completed event
    if (payload.type === 'checkout.session.completed') {
        const session = payload.data.object;

        // Fulfill the purchase...
        fulfillOrder(session);
    }

    res.status(200);
};