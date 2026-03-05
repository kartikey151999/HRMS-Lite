import { pgTable, text, serial, varchar, date, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id", { length: 50 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  department: text("department").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: serial("employee_id").references(() => employees.id, { onDelete: "cascade" }),
  date: date("date").notNull(), // Format: YYYY-MM-DD
  status: varchar("status", { length: 20 }).notNull(), // 'Present' | 'Absent'
});

// === RELATIONS ===
export const employeesRelations = relations(employees, ({ many }) => ({
  attendanceRecords: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, createdAt: true }).extend({
  email: z.string().email("Invalid email format"),
  employeeId: z.string().min(1, "Employee ID is required"),
  fullName: z.string().min(1, "Full Name is required"),
  department: z.string().min(1, "Department is required"),
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true }).extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
  status: z.enum(["Present", "Absent"]),
});

// === EXPLICIT API CONTRACT TYPES ===
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type EmployeeResponse = Employee;
export type EmployeesListResponse = Employee[];

export type AttendanceResponse = Attendance;
export type AttendanceListResponse = Attendance[];
