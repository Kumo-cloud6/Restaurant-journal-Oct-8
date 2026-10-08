export type ApiErrorCode = 'not_found' | 'invalid_input' | 'network' | 'unauthorized'

export class ApiError extends Error {
  readonly code: ApiErrorCode

  constructor(code: ApiErrorCode, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}
