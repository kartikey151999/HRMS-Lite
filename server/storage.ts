import { employees, attendance } from "@shared/schema";
import { db } from "./db";
import { eq, or } from "drizzle-orm";
import type { Employee, InsertEmployee, Attendance, InsertAttendance } from "@shared/schema";

export interface IStorage {
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmailOrId(email: string, employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  deleteEmployee(id: number): Promise<void>;
  
  getAttendance(employeeId: number): Promise<Attendance[]>;
  getAttendanceByDate(employeeId: number, date: string): Promise<Attendance | undefined>;
  markAttendance(attendance: InsertAttendance & { employeeId: number }): Promise<Attendance>;
}

export class DatabaseStorage implements IStorage {
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(employees.createdAt);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async getEmployeeByEmailOrId(email: string, employeeId: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(
      or(
        eq(employees.email, email),
        eq(employees.employeeId, employeeId)
      )
    );
    return employee;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db.insert(employees).values(insertEmployee).returning();
    return employee;
  }

  async deleteEmployee(id: number): Promise<void> {
    await db.delete(employees).where(eq(employees.id, id));
  }

  async getAttendance(employeeId: number): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.employeeId, employeeId)).orderBy(attendance.date);
  }

  async getAttendanceByDate(employeeId: number, date: string): Promise<Attendance | undefined> {
    // In PostgreSQL, date is often returned as a string or Date object depending on pg driver settings.
    // If it's a string comparison, we can do string manipulation. For exact date matching in drizzle,
    // eq() usually works if the provided string is in YYYY-MM-DD format.
    const records = await db.select().from(attendance).where(eq(attendance.employeeId, employeeId));
    // Since we store date as `date("date")` it returns as string 'YYYY-MM-DD' natively.
    return records.find(r => r.date === date);
  }

  async markAttendance(insertAtt: InsertAttendance & { employeeId: number }): Promise<Attendance> {
    const [record] = await db.insert(attendance).values(insertAtt).returning();
    return record;
  }
}

export const storage = new DatabaseStorage();