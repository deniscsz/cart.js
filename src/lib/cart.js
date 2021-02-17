import { makeResponse } from './utils'

const CartJS = ({ axios, provider = 'laravel-cart' }) => {
  const setProvider = () => {
    if (typeof provider === 'string') {
      const { urls, localItemName } = require(`./providers/${provider}`).default
      return { urls, localItemName }
    }
    return provider
  }

  const { localItemName } = setProvider()
  const checkoutId = localStorage.getItem(localItemName)

  const setUrls = () => {
    const { urls } = setProvider()
    const urlsKeys = Object.keys(urls)
    for (const urlKey of urlsKeys) {
      urls[urlKey] = urls[urlKey].replace(':checkoutId', checkoutId)
    }
    return urls
  }

  const {
    createUrl,
    getUrl,
    updateUrl,
    addItemUrl,
    updateItemQtyUrl,
    stripePaymentUrl,
  } = setUrls()

  /***
   * @function initCheckout Create if new and return a checkout instance
   * @param {string} url The url segment (optional)
   * @return {Object} Response status and data payload
   */
  const initCheckout = async () => {
    const { data, status, statusCode } = await getCheckoutInstance()
    if (status === 'error') {
      return await createCheckoutInstance()
    }
    return { data, status, statusCode }
  }

  /***
   * @function createCheckoutInstance Create a checkout instance
   * @return {Object} Response status and data payload
   */
  const createCheckoutInstance = async () => {
    try {
      const resp = await axios().post(createUrl)
      localStorage.setItem(localItemName, resp.data.cart.id)
      return makeResponse(resp)
    } catch ({ response }) {
      return makeResponse(response, 'error')
    }
  }

  /***
   * @function getCheckoutInstance Return a checkout instance
   * @return {Object} Response status and data payload
   */
  const getCheckoutInstance = async () => {
    try {
      const resp = await axios().get(getUrl)
      // TODO: Integrate check, if 404, delete localStorage item and createCheckoutInstance
      return makeResponse(resp)
    } catch ({ response }) {
      return makeResponse(response, 'error')
    }
  }

  /***
   * @function updateCheckoutInstance Update the current checkout instance
   * @param {Object} formData The client payload
   * @return {Object} Response status and data payload
   */
  const updateCheckoutInstance = async (formData) => {
    try {
      const resp = await axios().put(updateUrl, formData)
      return makeResponse(resp)
    } catch ({ response }) {
      return makeResponse(response, 'error')
    }
  }

  /***
   * @function addCheckoutItem Add a new item to the checkout instance
   * @param {Object} formData The client payload
   * @return {Object} Response status and data payload
   */
  const addCheckoutItem = async (formData) => {
    try {
      const resp = await axios().post(addItemUrl, formData)
      return makeResponse(resp)
    } catch ({ response }) {
      return makeResponse(response, 'error')
    }
  }

  /***
   * @function updateCheckoutItemQty Decrease or Increase the qty for a specific checkout item
   * @param {Number} itemId The item ID
   * @param {Number} initialQty The current qty (before update)
   * @param {String} direction The update direction, can be increment or something else (decrement)
   * @return {Object} Response status and data payload
   */
  const updateCheckoutItemQty = async (
    itemId,
    initialQty,
    direction = 'increment'
  ) => {
    const url = updateItemQtyUrl.replace(':itemId', itemId)
    try {
      let qty = initialQty + 1
      if (direction !== 'increment') {
        qty = initialQty > 1 ? initialQty - 1 : 1
      }
      const resp = await axios().put(url, {
        qty,
      })
      return makeResponse(resp)
    } catch ({ response }) {
      return makeResponse(response, 'error')
    }
  }

  /***
   * @function triggerStripePayment Trigger a payment request to the API using a Stripe token
   * @param {String} token Stripe Token ID
   * @return {Object} Response status and data payload
   */
  const triggerStripePayment = async (token) => {
    try {
      const resp = await axios().post(stripePaymentUrl, {
        token,
      })
      return makeResponse(resp)
    } catch ({ response }) {
      return makeResponse(response, 'error')
    }
  }

  return {
    initCheckout,
    createCheckoutInstance,
    getCheckoutInstance,
    updateCheckoutInstance,
    addCheckoutItem,
    updateCheckoutItemQty,
    triggerStripePayment,
  }
}

export default CartJS
