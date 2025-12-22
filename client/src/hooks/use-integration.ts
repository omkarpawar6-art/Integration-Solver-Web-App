import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertCalculation } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useHistory() {
  return useQuery({
    queryKey: [api.history.path],
    queryFn: async () => {
      const res = await fetch(api.history.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.history.responses[200].parse(await res.json());
    },
  });
}

export function useIntegrate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCalculation) => {
      const res = await fetch(api.integrate.path, {
        method: api.integrate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.integrate.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to calculate integral");
      }

      return api.integrate.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.path] });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.clearHistory.path, {
        method: api.clearHistory.method,
      });
      if (!res.ok) throw new Error("Failed to clear history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.path] });
      toast({
        title: "History Cleared",
        description: "All past calculations have been removed.",
      });
    },
  });
}
