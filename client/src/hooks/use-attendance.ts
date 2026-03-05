import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type AttendanceInput } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useEmployeeAttendance(employeeId: number) {
  return useQuery({
    queryKey: [api.attendance.listByEmployee.path, employeeId],
    queryFn: async () => {
      const url = buildUrl(api.attendance.listByEmployee.path, { employeeId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return [];
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return api.attendance.listByEmployee.responses[200].parse(await res.json());
    },
    enabled: !!employeeId && !isNaN(employeeId),
  });
}

export function useMarkAttendance(employeeId: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AttendanceInput) => {
      const validated = api.attendance.mark.input.parse(data);
      const url = buildUrl(api.attendance.mark.path, { employeeId });
      
      const res = await fetch(url, {
        method: api.attendance.mark.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 400) {
          const error = api.attendance.mark.responses[400].parse(errorData);
          throw new Error(error.message);
        }
        if (res.status === 404) {
          const error = api.attendance.mark.responses[404].parse(errorData);
          throw new Error(error.message);
        }
        if (res.status === 409) {
          const error = api.attendance.mark.responses[409].parse(errorData);
          throw new Error(error.message);
        }
        throw new Error("Failed to mark attendance");
      }
      return api.attendance.mark.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.attendance.listByEmployee.path, employeeId] });
      toast({ title: "Success", description: "Attendance marked successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}
