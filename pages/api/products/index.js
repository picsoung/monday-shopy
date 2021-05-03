import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();
monday.setToken(process.env.MONDAY_TOKEN)

export default async (req, res) => {
    // get all boards
    let boards = await monday.api('query { boards { id, name } }')
    //find board named product
    let productBoard = boards.data.boards.find((b) => b.name === 'Products')
    let productsRequest = await monday.api(`query { boards(ids: [${productBoard.id}]) {
    name
    id,
    items {
      id,
      name,
      column_values {
        id,
        title,
        value,
        text,
        type
      }
    }
  } }`)

    let products = []
    for (const item of productsRequest.data.boards[0].items) {
        let column_values = {}
        for (const column of Object.keys(item.column_values)) {
            let c = item.column_values[column]
            if (c.type === 'file') {
                let fileValue = JSON.parse(c.value)
                let filesId = fileValue.files.map((f) => f.assetId)
                let fileRequest = await monday.api(`query {assets (ids: [${filesId}]) {
            id
            public_url
            }}`)
                let fileUrls = fileRequest.data.assets.map((f) => f.public_url)
                column_values[c.title.toLowerCase()] = fileUrls
            } else {
                column_values[c.title.toLowerCase()] = c.text
            }
        }
        products.push({
            id: item.id,
            name: item.name,
            ...column_values
        })
    }

    res.send({
        products
    })
}