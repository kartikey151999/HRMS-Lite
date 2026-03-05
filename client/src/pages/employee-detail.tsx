import { useState } from "react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout";
import { useEmployee } from "@/hooks/use-employees";
import { useEmployeeAttendance } from "@/hooks/use-attendance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AttendanceForm } from "@/components/attendance-form";
import { ArrowLeft, CalendarPlus, Mail, Briefcase, Hash, Calendar, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function EmployeeDetail() {
  const { id } = useParams();
  const employeeId = parseInt(id || "0");
  const [isMarkOpen, setIsMarkOpen] = useState(false);

  const { data: employee, isLoading: isLoadingEmp } = useEmployee(employeeId);
  const { data: attendance, isLoading: isLoadingAtt } = useEmployeeAttendance(employeeId);

  if (isLoadingEmp) {
    return (
      <Layout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold">Employee Not Found</h2>
          <p className="text-muted-foreground mt-2 mb-6">The profile you're looking for doesn't exist or was removed.</p>
          <Link href="/" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Link>
        </div>
      </Layout>
    );
  }

  // Bonus feature: Calculate stats
  const totalRecords = attendance?.length || 0;
  const presentDays = attendance?.filter(r => r.status === "Present").length || 0;
  const absentDays = attendance?.filter(r => r.status === "Absent").length || 0;
  const attendanceRate = totalRecords > 0 ? Math.round((presentDays / totalRecords) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50"></div>
              
              <div className="relative pt-6 flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 border-4 border-card shadow-sm mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold font-display">
                    {employee.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <h1 className="text-2xl font-display font-bold text-foreground">{employee.fullName}</h1>
                <p className="text-primary font-medium mt-1">{employee.department}</p>
                
                <div className="w-full mt-8 space-y-4 text-left">
                  <div className="flex items-center gap-3 text-muted-foreground p-3 rounded-xl bg-muted/30">
                    <Hash className="w-5 h-5 text-primary/70" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Employee ID</p>
                      <p className="font-medium text-foreground">{employee.employeeId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground p-3 rounded-xl bg-muted/30">
                    <Mail className="w-5 h-5 text-primary/70" />
                    <div className="truncate">
                      <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Email Address</p>
                      <p className="font-medium text-foreground truncate">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground p-3 rounded-xl bg-muted/30">
                    <Briefcase className="w-5 h-5 text-primary/70" />
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Department</p>
                      <p className="font-medium text-foreground">{employee.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Attendance Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 font-medium text-sm">Present</span>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-800 font-display">{presentDays}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red-700 font-medium text-sm">Absent</span>
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <p className="text-3xl font-bold text-red-800 font-display">{absentDays}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Attendance Rate</span>
                  <span className="font-bold text-foreground">{attendanceRate}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-1000" 
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Area: Attendance Records */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
              <div className="p-6 border-b border-border bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">Attendance History</h2>
                  <p className="text-sm text-muted-foreground">Log of recorded working days</p>
                </div>
                
                <Dialog open={isMarkOpen} onOpenChange={setIsMarkOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 px-5 rounded-xl shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform">
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Mark Attendance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px] rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">Mark Attendance</DialogTitle>
                      <DialogDescription>
                        Record attendance for {employee.fullName}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <AttendanceForm 
                        employeeId={employee.id} 
                        onSuccess={() => setIsMarkOpen(false)} 
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex-1 relative">
                {isLoadingAtt ? (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : attendance?.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                      <Calendar className="w-8 h-8 opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">No Records Yet</h3>
                    <p className="text-muted-foreground max-w-[250px] mb-6 text-sm">
                      Start tracking {employee.fullName.split(' ')[0]}'s attendance by marking a date.
                    </p>
                    <Button onClick={() => setIsMarkOpen(true)} variant="outline" className="rounded-xl h-10">
                      Mark First Record
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-auto max-h-[600px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                        <TableRow className="hover:bg-transparent border-b border-border">
                          <TableHead className="font-semibold py-4 pl-6">Date</TableHead>
                          <TableHead className="font-semibold py-4">Day</TableHead>
                          <TableHead className="font-semibold py-4 text-right pr-6">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendance?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => {
                          const dateObj = new Date(record.date);
                          const isPresent = record.status === "Present";
                          
                          return (
                            <TableRow key={record.id} className="group hover:bg-muted/30 transition-colors">
                              <TableCell className="py-4 pl-6 font-medium text-foreground">
                                {format(dateObj, "MMM dd, yyyy")}
                              </TableCell>
                              <TableCell className="py-4 text-muted-foreground">
                                {format(dateObj, "EEEE")}
                              </TableCell>
                              <TableCell className="py-4 text-right pr-6">
                                <Badge 
                                  variant="outline" 
                                  className={`
                                    px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md border-0
                                    ${isPresent 
                                      ? "bg-green-100 text-green-700" 
                                      : "bg-red-100 text-red-700"}
                                  `}
                                >
                                  {record.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
