import { useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'

interface ErrorParam {
  message: string
  status?: number
  response?: AxiosResponse
}

class RequestError extends Error {
  message: string

  status?: number

  response?: AxiosResponse

  constructor({ message, status, response }: ErrorParam) {
    super()
    this.message = message
    this.status = status
    this.response = response
  }

  isApiException = true
}

export type ApiResult<T> = {
  status?: number
  result?: T
  ok: boolean
  complete: boolean
  error?: RequestError
}

type ReturnType<T> = Promise<AxiosResponse<T> | undefined> | undefined

/**
 * Calls backend to fetch data
 * @param apiCall function that returns data, either as a promise or directly
 * @param deps dependencies used for the above function call
 * @param snack should snackbar be invoked (defaults to false)
 * @returns ApiResult
 */
export function useApi<T>(
  apiCall: () => ReturnType<T>,
  deps: unknown[],
): ApiResult<T> {
  const [result, setResult] = useState<T | undefined>()
  const [status, setStatus] = useState<number | undefined>()
  const [error, setError] = useState<RequestError | undefined>()

  useEffect(() => {
    let canceled = false
    setStatus(undefined)
    setError(undefined)

    apiCall()
      ?.then((response) => {
        if (canceled) {
          return
        }
        setResult(response?.data)
        setStatus(200)
      })
      .catch((reason: RequestError) => {
        setStatus(reason.status)
        setResult(undefined)
        setError(reason)
      })

    return () => {
      canceled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps])

  return {
    status,
    result,
    ok: status === 200,
    complete: status !== undefined,
    error,
  }
}
