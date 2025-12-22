import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useIntegrate } from "@/hooks/use-integration";
import { MathRenderer } from "@/components/MathRenderer";
import { insertCalculationSchema } from "@shared/schema";
import { ArrowRight, Loader2, Sparkles, RefreshCw, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { clsx } from "clsx";

// Frontend validation schema extending the base one
const formSchema = insertCalculationSchema.extend({
  expression: z.string().min(1, "Expression is required"),
  variable: z.string().min(1, "Variable is required"),
  lowerBound: z.string().optional(),
  upperBound: z.string().optional(),
}).refine((data) => {
  if (data.type === "definite") {
    return !!data.lowerBound && !!data.upperBound;
  }
  return true;
}, {
  message: "Bounds are required for definite integrals",
  path: ["lowerBound"], // Show error on lowerBound
});

type FormData = z.infer<typeof formSchema>;

export default function CalculatorPage() {
  const [result, setResult] = useState<{ latex: string; id: number } | null>(null);
  
  const { mutate: integrate, isPending } = useIntegrate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "indefinite",
      variable: "x",
      expression: "",
      lowerBound: "",
      upperBound: "",
    },
  });

  const calculationType = form.watch("type");

  const onSubmit = (data: FormData) => {
    integrate(data, {
      onSuccess: (data) => {
        setResult(data);
      },
    });
  };

  const handleReset = () => {
    form.reset();
    setResult(null);
  };

  return (
    <div className="space-y-8">
      <header className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Integral Calculator</h2>
        <p className="text-slate-500 text-lg">Solve definite and indefinite integrals with step-by-step precision.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 md:p-8 shadow-xl shadow-slate-200/50 border-slate-100 bg-white/80 backdrop-blur-sm rounded-2xl">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Type Selection */}
              <div className="space-y-3">
                <Label className="text-slate-500 font-medium text-xs uppercase tracking-wider">Calculation Type</Label>
                <RadioGroup 
                  defaultValue="indefinite" 
                  onValueChange={(val) => form.setValue("type", val as "definite" | "indefinite")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className={clsx(
                    "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-slate-50",
                    calculationType === "indefinite" ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-slate-100"
                  )}>
                    <RadioGroupItem value="indefinite" id="indefinite" className="sr-only" />
                    <Label htmlFor="indefinite" className="cursor-pointer font-semibold text-slate-700">Indefinite</Label>
                    <span className="text-xs text-slate-400">Find antiderivative</span>
                  </div>
                  
                  <div className={clsx(
                    "relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all hover:bg-slate-50",
                    calculationType === "definite" ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-slate-100"
                  )}>
                    <RadioGroupItem value="definite" id="definite" className="sr-only" />
                    <Label htmlFor="definite" className="cursor-pointer font-semibold text-slate-700">Definite</Label>
                    <span className="text-xs text-slate-400">Compute area</span>
                  </div>
                </RadioGroup>
              </div>

              {/* Expression Input */}
              <div className="space-y-2">
                <Label htmlFor="expression" className="text-slate-500 font-medium text-xs uppercase tracking-wider">Expression</Label>
                <div className="relative">
                  <Input 
                    id="expression"
                    {...form.register("expression")}
                    placeholder="e.g. x^2 + sin(x)"
                    className="h-14 px-4 font-mono text-lg bg-slate-50 border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all rounded-xl"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none font-serif italic text-xl">
                    f({form.watch("variable")})
                  </div>
                </div>
                {form.formState.errors.expression && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.expression.message}</p>
                )}
              </div>

              {/* Variable Input */}
              <div className="space-y-2">
                <Label htmlFor="variable" className="text-slate-500 font-medium text-xs uppercase tracking-wider">Variable</Label>
                <Input 
                  id="variable"
                  {...form.register("variable")}
                  placeholder="x"
                  className="h-12 w-24 font-mono text-center bg-slate-50 border-slate-200 rounded-xl"
                />
                {form.formState.errors.variable && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.variable.message}</p>
                )}
              </div>

              {/* Bounds Inputs (Conditional) */}
              <AnimatePresence>
                {calculationType === "definite" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="lowerBound" className="text-slate-500 font-medium text-xs uppercase tracking-wider">Lower Bound</Label>
                      <Input 
                        id="lowerBound"
                        {...form.register("lowerBound")}
                        placeholder="0"
                        className="h-12 font-mono bg-slate-50 border-slate-200 rounded-xl"
                      />
                      {form.formState.errors.lowerBound && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.lowerBound.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upperBound" className="text-slate-500 font-medium text-xs uppercase tracking-wider">Upper Bound</Label>
                      <Input 
                        id="upperBound"
                        {...form.register("upperBound")}
                        placeholder="pi"
                        className="h-12 font-mono bg-slate-50 border-slate-200 rounded-xl"
                      />
                      {form.formState.errors.upperBound && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.upperBound.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Computing...
                  </>
                ) : (
                  <>
                    Calculate
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Result Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Card className="overflow-hidden border-2 border-primary/10 shadow-2xl shadow-primary/5 bg-white rounded-2xl">
                  <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Sparkles className="w-5 h-5" />
                      Result
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500 hover:text-primary">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New
                    </Button>
                  </div>
                  
                  <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
                    <div className="w-full overflow-x-auto p-4 flex justify-center">
                      <MathRenderer 
                        latex={result.latex} 
                        block 
                        className="text-2xl md:text-3xl text-slate-800" 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 px-6 py-4 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-500">
                      Calculated successfully using symbolic integration.
                    </p>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Calculator className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Ready to Calculate</h3>
                <p className="text-slate-500 max-w-xs">
                  Enter an expression on the left to see the step-by-step solution here.
                </p>
                
                <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm w-full">
                  {[
                    { label: "x^2", val: "x^2" },
                    { label: "sin(x)", val: "sin(x)" },
                    { label: "1/x", val: "1/x" },
                    { label: "e^x", val: "e^x" }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => form.setValue("expression", preset.val)}
                      className="px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-600 hover:border-primary hover:text-primary transition-colors shadow-sm"
                    >
                      ∫ {preset.label} dx
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
