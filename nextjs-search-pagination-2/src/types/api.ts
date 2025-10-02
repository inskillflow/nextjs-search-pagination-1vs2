// ApiResponse<T> : enveloppe standard succès/échec avec payload optionnel (data) et message/erreur.
// PaginatedResponse<T> : ApiResponse + métadonnées de pagination (page, limit, total, totalPages).
// ApiErrorShape : forme normalisée d’une erreur métier (code/message + details facultatifs).

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiErrorShape {
  code: string
  message: string
  details?: Record<string, unknown>
}
