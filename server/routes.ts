import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import nerdamer from "nerdamer";
import "nerdamer/Calculus"; 
import "nerdamer/Algebra";
import "nerdamer/Solve";
import "nerdamer/Extra";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.integrate.path, async (req, res) => {
    try {
      const input = api.integrate.input.parse(req.body);
      
      let result: string;
      let latex: string;

      try {
        if (input.type === 'indefinite') {
          // Indefinite integration
          const integrated = nerdamer(`integrate(${input.expression}, ${input.variable})`);
          result = integrated.toString();
          latex = integrated.toTeX();
        } else {
          // Definite integration
          // nerdamer format: defint(expression, lower, upper, variable)
          // Note: nerdamer's defint args are (expression, lower, upper, variable)
          const expression = `defint(${input.expression}, ${input.lowerBound}, ${input.upperBound}, ${input.variable})`;
          const integrated = nerdamer(expression);
          result = integrated.text(); // or .toString()
          latex = integrated.toTeX();
        }

        const saved = await storage.saveCalculation({
          ...input,
          result,
          latex
        });

        res.json({
          result: saved.result,
          latex: saved.latex,
          id: saved.id
        });

      } catch (mathError: any) {
        return res.status(400).json({ 
          message: `Math Error: ${mathError.message || 'Could not compute integral'}`,
          field: 'expression'
        });
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.history.path, async (req, res) => {
    const history = await storage.getHistory();
    res.json(history);
  });

  app.delete(api.clearHistory.path, async (req, res) => {
    await storage.clearHistory();
    res.status(204).send();
  });

  return httpServer;
}
