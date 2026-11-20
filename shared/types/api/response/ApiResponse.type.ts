export interface ApiErrorDetail {
  field?: string
  message: string
}

export interface ApiErrorBody {
  code: string
  details: ApiErrorDetail[]
}

export interface ApiResponse<T> {
  success: true
  message: string
  data: T
}

export interface ApiResponseError {
  success: false
  error: ApiErrorBody
}

export type ApiResult<T> = ApiResponse<T> | ApiResponseError
