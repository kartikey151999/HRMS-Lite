import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { useEmployees, useDeleteEmployee } from "@/hooks/use-employees";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmployeeForm } from "@/components/employee-form";
import { Plus, Users, Trash2, ArrowRight, Loader2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: employees, isLoading } = useEmployees();
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Employee Directory</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage your team and track attendance records.</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 px-6 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">New Employee</DialogTitle>
                <DialogDescription>
                  Enter the details of the new team member to add them to the directory.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <EmployeeForm onSuccess={() => setIsAddOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-4xl font-display font-bold text-foreground mt-2">
                  {isLoading ? "-" : employees?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-slate-50/50">
            <h2 className="font-semibold text-lg">All Employees</h2>
          </div>
          
          <div className="relative w-full overflow-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p>Loading directory...</p>
              </div>
            ) : employees?.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">No employees yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6">Your directory is empty. Get started by adding your first team member.</p>
                <Button onClick={() => setIsAddOpen(true)} variant="outline" className="rounded-xl h-11">
                  Add First Employee
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/50 border-b border-border">
                    <TableHead className="font-semibold py-4">Employee</TableHead>
                    <TableHead className="font-semibold py-4">ID</TableHead>
                    <TableHead className="font-semibold py-4">Department</TableHead>
                    <TableHead className="text-right font-semibold py-4 pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees?.map((emp) => (
                    <TableRow key={emp.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-primary/10">
                            <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                              {emp.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{emp.fullName}</span>
                            <span className="text-sm text-muted-foreground">{emp.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="font-mono text-xs px-2 py-1 rounded-md">
                          {emp.employeeId}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {emp.department}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/employees/${emp.id}`} className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-secondary hover:text-secondary-foreground h-9 px-4 py-2 rounded-xl text-primary border border-transparent hover:border-border">
                            Profile
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Employee</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {emp.fullName}? This will permanently remove their profile and all associated attendance records.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteEmployee(emp.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
