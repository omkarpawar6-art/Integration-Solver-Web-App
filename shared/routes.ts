import { z } from 'zod';
import { insertCalculationSchema, calculations } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  integrate: {
    method: 'POST' as const,
    path: '/api/integrate',
    input: insertCalculationSchema,
    responses: {
      200: z.object({
        result: z.string(),
        latex: z.string(),
        id: z.number()
      }),
      400: errorSchemas.validation,
      500: errorSchemas.internal
    },
  },
  history: {
    method: 'GET' as const,
    path: '/api/history',
    responses: {
      200: z.array(z.custom<typeof calculations.$inferSelect>()),
    },
  },
  clearHistory: {
    method: 'DELETE' as const,
    path: '/api/history',
    responses: {
      204: z.void(),
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
