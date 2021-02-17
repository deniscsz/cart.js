# Cart.js

Cart.js is library to handle cart & checkout operations in a JavaScript environment.

- 🔋 Work best with [Laravel-cart](https://github.com/yabhq/laravel-cart)
- 📦 Tiny size (<6kb)
- 🪐 Universal module: built for use in `script` tags and modern JS frameworks

## Installation

```bash
npm install @yabhq/cart.js
```

## Usage

Cart.js relies on [axios](https://github.com/axios/axios). It accepts 2 params:
| Name | Details | Required |
|-|-| - |
| `axios` | An axios instance | Yes |
| `provider` | Default is `laravel-cart`. Can be overridden with a Provider object (see below) | No

### Available methods (promised based)

| Method                                                               | Details                                                   |
| -------------------------------------------------------------------- | --------------------------------------------------------- |
| `initCheckout()`                                                     | Create a checkout instance if none and return it          |
| `createCheckoutInstance()`                                           | Create a checkout instance                                |
| `getCheckoutInstance()`                                              | Return a checkout instance                                |
| `updateCheckoutInstance(payload)`                                    | Update the current checkout instance                      |
| `addCheckoutItem(payload)`                                           | Add a new item to the checkout instance                   |
| `updateCheckoutItemQty(itemId, initialQty, direction = 'increment')` | Decrease or Increase the qty for a specific checkout item |
| `triggerStripePayment(tokenId)`                                      | Trigger a payment request using a Stripe token            |

### Response

Each method returns the following object:

```javascript
{
  data, // API payload
    status, // 'success' or 'error'
    statusCode // eg. 200, 401, etc.
}
```

## Examples

### Script

```html
<script>
  var cartJS = cart({ axios: axios })
  console.log(cartJS().initCheckout())
</script>
```

### As a plugin (ES6+)

```javascript
import cartJS from 'cart.js'
import axios from './axios'

const cart = () =>
  cartJS({
    axios,
  })

export default cart
```

```javascript
// And then in any file
import cartJS from '/my/plugins/folder/cart.js

const initMyCheckout = async () => {
  const {data, status, statusCode} = await cartJS().initCheckout()
  console.log(data)
}

```

## Providers

Default configuration can be overriden using a custom provider. Here is the default `laravel-cart` provider:

```javascript
export default {
  urls: {
    createUrl: 'checkout',
    getUrl: 'checkout/:checkoutId',
    updateUrl: 'checkout/:checkoutId',
    addItemUrl: 'checkout/:checkoutId/items',
    updateItemQtyUrl: 'checkout/:checkoutId/items/:itemId',
    stripePaymentUrl: 'checkout/:checkoutId/stripe',
  },
  localItemName: 'cj_ckId',
}
```

| Name          | Details                             |
| ------------- | ----------------------------------- |
| urls          | Object mapping the URLs             |
| localItemName | Name given to the localStorage item |

`urls` values can be replaced by anything, as long as they integrate the `:checkoutId` and `:itemId` placeholders

To override the provider, just pass it at the second param when instantiating CartJS:

```javascript
// Example with the plugin (ES6+) approach
import cartJS from 'cart.js'
import axios from './axios'

const provider = {
  urls: {
    createUrl: 'cart',
    getUrl: 'cart/:checkoutId',
    updateUrl: 'cart/:checkoutId',
    addItemUrl: 'cart/:checkoutId/products',
    updateItemQtyUrl: 'cart/:checkoutId/products/:itemId',
    stripePaymentUrl: 'cart/:checkoutId/payment',
  },
  localItemName: 'cart_id',
}

const cart = () =>
  cartJS({
    axios,
    provider,
  })

export default cart
```

## Contributing

Pull requests are welcome.

## License

[MIT](https://choosealicense.com/licenses/mit/)
