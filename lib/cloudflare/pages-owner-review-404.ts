type PagesFunctionContext = {
  next(): Promise<Response>
}
export async function ownerReviewNotFound(context: PagesFunctionContext): Promise<Response> {
  const page = await context.next()
  const headers = new Headers(page.headers)
  headers.set('X-Robots-Tag', 'noindex')
  return new Response(page.body, {
    status: 404,
    statusText: 'Not Found',
    headers,
  })
}
