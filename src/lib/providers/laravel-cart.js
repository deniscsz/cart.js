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
