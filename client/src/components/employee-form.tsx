import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmployeeSchema } from "@shared/schema";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateEmployee } from "@/hooks/use-employees";
import { Loader2 } from "lucide-react";

type EmployeeFormValues = z.infer<typeof insertEmployeeSchema>;

interface EmployeeFormProps {
  onSuccess: () => void;
}

export function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const { mutate, isPending } = useCreateEmployee();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(insertEmployeeSchema),
    defaultValues: {
      employeeId: "",
      fullName: "",
      email: "",
      department: "",
    },
  });

  const onSubmit = (data: EmployeeFormValues) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. EMP-001" className="h-11 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" className="h-11 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Email Address</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@company.com" type="email" className="h-11 rounded-xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Department</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Engineering, HR, Sales" className="h-11 rounded-xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end">
          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full md:w-auto h-11 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Creating..." : "Add Employee"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
