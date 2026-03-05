import { z } from 'zod';
import { insertEmployeeSchema, insertAttendanceSchema, employees, attendance } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  conflict: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  employees: {
    list: {
      method: 'GET' as const,
      path: '/api/employees' as const,
      responses: {
        200: z.array(z.custom<typeof employees.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/employees/:id' as const,
      responses: {
        200: z.custom<typeof employees.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/employees' as const,
      input: insertEmployeeSchema,
      responses: {
        201: z.custom<typeof employees.$inferSelect>(),
        400: errorSchemas.validation,
        409: errorSchemas.conflict,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/employees/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  attendance: {
    listByEmployee: {
      method: 'GET' as const,
      path: '/api/employees/:employeeId/attendance' as const,
      responses: {
        200: z.array(z.custom<typeof attendance.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
    mark: {
      method: 'POST' as const,
      path: '/api/employees/:employeeId/attendance' as const,
      input: insertAttendanceSchema.omit({ employeeId: true }),
      responses: {
        201: z.custom<typeof attendance.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        409: errorSchemas.conflict, // If attendance for that date is already marked
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
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

// ============================================
// TYPE HELPERS
// ============================================
export type EmployeeInput = z.infer<typeof api.employees.create.input>;
export type EmployeeResponse = z.infer<typeof api.employees.create.responses[201]>;
export type EmployeesListResponse = z.infer<typeof api.employees.list.responses[200]>;

export type AttendanceInput = z.infer<typeof api.attendance.mark.input>;
export type AttendanceResponse = z.infer<typeof api.attendance.mark.responses[201]>;
export type AttendanceListResponse = z.infer<typeof api.attendance.listByEmployee.responses[200]>;
