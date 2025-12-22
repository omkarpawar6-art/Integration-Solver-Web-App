import { useHistory, useClearHistory } from "@/hooks/use-integration";
import { MathRenderer } from "@/components/MathRenderer";
import { format } from "date-fns";
import { Trash2, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
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

export default function HistoryPage() {
  const { data: history, isLoading } = useHistory();
  const { mutate: clearHistory, isPending: isClearing } = useClearHistory();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const isEmpty = !history || history.length === 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Calculation History</h2>
          <p className="text-slate-500">Review your past integration problems.</p>
        </div>
        
        {!isEmpty && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive-foreground hover:bg-destructive border-destructive/20">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your entire calculation history from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => clearHistory()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {isClearing ? "Clearing..." : "Yes, clear history"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </header>

      {isEmpty ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No calculations yet</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Calculations you perform will appear here automatically.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow duration-200 border-slate-200 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
                        <span className={item.type === 'definite' ? 'text-indigo-500' : 'text-blue-500'}>
                          {item.type} Integral
                        </span>
                        <span>•</span>
                        <span>{item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy h:mm a") : "Just now"}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0">
                         {/* We manually reconstruct the integral latex here for display context */}
                        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 min-w-fit">
                          <MathRenderer 
                            latex={`\\int${item.type === 'definite' ? `_{${item.lowerBound}}^{${item.upperBound}}` : ''} ${item.expression} \\, d${item.variable}`} 
                            className="text-lg text-slate-700"
                          />
                        </div>
                        
                        <ArrowRight className="w-5 h-5 text-slate-300 shrink-0" />
                        
                        <div className="bg-primary/5 px-4 py-2 rounded-lg border border-primary/10 min-w-fit">
                          <MathRenderer latex={item.latex || item.result} className="text-lg text-slate-900 font-semibold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
