const RETRY_DELAYS_MS = [250, 750]
const RETRYABLE_HTTP_STATUSES = new Set([429, 500, 502, 503, 504])
const DEFAULT_TIMEOUT_MS = 15_000

const defaultSleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function canRetry(attempt) {
  return attempt < RETRY_DELAYS_MS.length
}

async function waitBeforeRetry(attempt, sleepImpl) {
  await sleepImpl(RETRY_DELAYS_MS[attempt])
}

export async function readJsonWithRetry(
  url,
  requestInit,
  {
    fetchImpl = fetch,
    sleepImpl = defaultSleep,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = {},
) {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    let response
    try {
      response = await fetchImpl(url, {...requestInit, signal: controller.signal})
    } catch {
      clearTimeout(timeout)
      if (canRetry(attempt)) {
        await waitBeforeRetry(attempt, sleepImpl)
        continue
      }
      return {ok: false, failure: 'network'}
    }

    if (!response.ok) {
      clearTimeout(timeout)
      if (RETRYABLE_HTTP_STATUSES.has(response.status) && canRetry(attempt)) {
        await waitBeforeRetry(attempt, sleepImpl)
        continue
      }
      return {ok: false, failure: 'http', status: response.status}
    }

    let body
    try {
      body = await response.text()
    } catch {
      clearTimeout(timeout)
      if (canRetry(attempt)) {
        await waitBeforeRetry(attempt, sleepImpl)
        continue
      }
      return {ok: false, failure: 'network'}
    }
    clearTimeout(timeout)

    try {
      return {ok: true, payload: JSON.parse(body)}
    } catch {
      if (canRetry(attempt)) {
        await waitBeforeRetry(attempt, sleepImpl)
        continue
      }
      return {ok: false, failure: 'json'}
    }
  }

  return {ok: false, failure: 'network'}
}
