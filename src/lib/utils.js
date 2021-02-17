const makeResponse = (resp, status = 'success') => {
  return {
    status,
    statusCode: resp.status,
    data: resp.data,
  }
}

export { makeResponse }
