export class ProjectInquiryRequestError extends Error {
  readonly unconfirmed: boolean
  constructor(message: string, unconfirmed: boolean) {
    super(message)
    this.name = 'ProjectInquiryRequestError'
    this.unconfirmed = unconfirmed
  }
}

// A client timeout/disconnection does not prove that the provider rejected the
// request. Never automatically retry a POST or turn an unknown result into one.
// Also used by the short general inquiry; preserve its injected HTTP boundary.
export async function sendProjectInquiry(endpoint: string, body: FormData, request: typeof fetch = fetch) {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const deadline = new Promise<Response>((_resolve, reject) => {
      timer = setTimeout(() => {
        controller.abort()
        reject(new ProjectInquiryRequestError('The response took too long. We cannot confirm whether your request was received.', true))
      }, 60_000)
    })
    const response = await Promise.race([
      request(endpoint, {method: 'POST', headers: {Accept: 'application/json'}, body, signal: controller.signal}),
      deadline,
    ])
    if (!response.ok) {
      if (response.status === 408 || response.status >= 500) {
        throw new ProjectInquiryRequestError('The service did not return a confirmed result. Your request may already have been received.', true)
      }
      throw new ProjectInquiryRequestError(
        response.status === 429
          ? 'The form service is limiting requests. Please wait before trying again, or contact us below.'
          : 'The form service did not accept this submission. Review your details before trying again, or contact us below.',
        false,
      )
    }
  } catch (error) {
    if (error instanceof ProjectInquiryRequestError) throw error
    throw new ProjectInquiryRequestError('The connection ended without a confirmed result. We cannot tell whether your request was received.', true)
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
}
