import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Employees
  app.get(api.employees.list.path, async (req, res) => {
    const allEmployees = await storage.getEmployees();
    res.status(200).json(allEmployees);
  });

  app.get(api.employees.get.path, async (req, res) => {
    const employee = await storage.getEmployee(Number(req.params.id));
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  });

  app.post(api.employees.create.path, async (req, res) => {
    try {
      const input = api.employees.create.input.parse(req.body);
      const existing = await storage.getEmployeeByEmailOrId(input.email, input.employeeId);
      if (existing) {
        return res.status(409).json({ message: "Employee with this email or ID already exists" });
      }
      
      const newEmployee = await storage.createEmployee(input);
      res.status(201).json(newEmployee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.employees.delete.path, async (req, res) => {
    const employee = await storage.getEmployee(Number(req.params.id));
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    await storage.deleteEmployee(Number(req.params.id));
    res.status(204).send();
  });

  // Attendance
  app.get(api.attendance.listByEmployee.path, async (req, res) => {
    const employee = await storage.getEmployee(Number(req.params.employeeId));
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const records = await storage.getAttendance(Number(req.params.employeeId));
    res.status(200).json(records);
  });

  app.post(api.attendance.mark.path, async (req, res) => {
    try {
      const employeeId = Number(req.params.employeeId);
      const employee = await storage.getEmployee(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const input = api.attendance.mark.input.parse(req.body);
      const existingRecord = await storage.getAttendanceByDate(employeeId, input.date);
      if (existingRecord) {
        return res.status(409).json({ message: "Attendance for this date is already marked" });
      }

      const record = await storage.markAttendance({ ...input, employeeId });
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed Data
  setTimeout(async () => {
    try {
      const existing = await storage.getEmployees();
      if (existing.length === 0) {
        const emp1 = await storage.createEmployee({
          employeeId: "EMP001",
          fullName: "Alice Smith",
          email: "alice@example.com",
          department: "Engineering"
        });
        const emp2 = await storage.createEmployee({
          employeeId: "EMP002",
          fullName: "Bob Jones",
          email: "bob@example.com",
          department: "Human Resources"
        });

        // Use today's date so it makes sense
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        await storage.markAttendance({ employeeId: emp1.id, date: yesterday, status: "Present" });
        await storage.markAttendance({ employeeId: emp1.id, date: today, status: "Present" });
        
        await storage.markAttendance({ employeeId: emp2.id, date: yesterday, status: "Present" });
        await storage.markAttendance({ employeeId: emp2.id, date: today, status: "Absent" });
      }
    } catch (error) {
      console.error("Error seeding DB:", error);
    }
  }, 1000);

  return httpServer;
}