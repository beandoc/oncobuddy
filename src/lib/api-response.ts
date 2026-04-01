import { NextResponse } from 'next/server';

/**
 * Standard Clinical API Envelope (Technical Guidance Section 1).
 * Features success boolean, data payload, error object (with codes), and pagination meta.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any;
  } | null;
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
    requestId: string;
  };
}

/**
 * Common Clinical Error Codes Taxonomy (Technical Guidance Section 2).
 */
export const CLINICAL_ERRORS = {
  UNAUTHORIZED: 'UNAUTHORIZED_ACCESS',
  SYMPTOM_LOG_DUPLICATE: 'SYMPTOM_LOG_DUPLICATE',
  PATIENT_NOT_FOUND: 'PATIENT_NOT_IN_PANEL',
  BREACH_THRESHOLD_ERROR: 'THRESHOLD_EVALUATION_FAILED',
  VALIDATION_FAILED: 'SCHEMA_VALIDATION_ERROR',
  INTERNAL_FAULT: 'SYSTEM_RUNTIME_FAULT'
} as const;

/**
 * Factory for consistent API responses.
 * (Technical Guidance Section 1).
 */
export function createApiResponse<T>(
  data: T | null, 
  error: ApiResponse['error'] | null = null,
  requestId: string = 'REQ-' + Math.random().toString(36).substr(2, 9).toUpperCase()
) {
  const success = !error;
  
  return NextResponse.json(
    { 
      success, 
      data, 
      error,
      meta: { requestId }
    },
    { 
      status: error ? getStatusFromCode(error.code) : 200,
      headers: {
        'X-Request-ID': requestId
      }
    }
  );
}

function getStatusFromCode(code: string): number {
  switch (code) {
    case CLINICAL_ERRORS.UNAUTHORIZED: return 401;
    case CLINICAL_ERRORS.VALIDATION_FAILED: return 422;
    case CLINICAL_ERRORS.PATIENT_NOT_FOUND: return 404;
    default: return 500;
  }
}
