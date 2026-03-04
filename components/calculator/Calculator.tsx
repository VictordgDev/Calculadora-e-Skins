"use client";

import { useState, useCallback } from "react";
import { SKINS, SkinId } from "@/lib/skins";
import { cn } from "@/lib/utils";

interface CalculatorProps {
  skinId: SkinId;
  onCalcComplete?: () => void; // called after each = press for XP
}

type Operation = "+" | "-" | "×" | "÷" | null;

export function Calculator({ skinId, onCalcComplete }: CalculatorProps) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");

  const skin = SKINS[skinId];

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression("");
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay(String(parseFloat(display) * -1));
  }, [display]);

  const percentage = useCallback(() => {
    setDisplay(String(parseFloat(display) / 100));
  }, [display]);

  const handleOperation = useCallback((nextOperation: Operation) => {
    const inputValue = parseFloat(display);
    if (previousValue !== null && operation && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(formatResult(result));
      setPreviousValue(result);
    } else {
      setPreviousValue(inputValue);
    }
    setExpression(`${display} ${nextOperation}`);
    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation, waitingForOperand]);

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display);
    if (previousValue !== null && operation) {
      const result = calculate(previousValue, inputValue, operation);
      setDisplay(formatResult(result));
      setExpression(`${expression} ${display} =`);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      onCalcComplete?.();
    }
  }, [display, previousValue, operation, expression, onCalcComplete]);

  const buttons = [
    { label: "C", action: clear, type: "function" },
    { label: "±", action: toggleSign, type: "function" },
    { label: "%", action: percentage, type: "function" },
    { label: "÷", action: () => handleOperation("÷"), type: "operator" },
    { label: "7", action: () => inputDigit("7"), type: "number" },
    { label: "8", action: () => inputDigit("8"), type: "number" },
    { label: "9", action: () => inputDigit("9"), type: "number" },
    { label: "×", action: () => handleOperation("×"), type: "operator" },
    { label: "4", action: () => inputDigit("4"), type: "number" },
    { label: "5", action: () => inputDigit("5"), type: "number" },
    { label: "6", action: () => inputDigit("6"), type: "number" },
    { label: "-", action: () => handleOperation("-"), type: "operator" },
    { label: "1", action: () => inputDigit("1"), type: "number" },
    { label: "2", action: () => inputDigit("2"), type: "number" },
    { label: "3", action: () => inputDigit("3"), type: "number" },
    { label: "+", action: () => handleOperation("+"), type: "operator" },
    { label: "0", action: () => inputDigit("0"), type: "number", wide: true },
    { label: ",", action: inputDecimal, type: "number" },
    { label: "=", action: handleEquals, type: "equals" },
  ];

  return (
    <div className={cn("rounded-2xl p-4 w-72 shadow-2xl select-none", skin.preview.bg)}>
      {/* Display */}
      <div className={cn("rounded-xl p-4 mb-3 min-h-[80px] flex flex-col justify-end", skin.preview.display)}>
        <div className="text-xs opacity-50 truncate h-4">{expression}</div>
        <div className="text-3xl font-mono font-bold text-right truncate">
          {display.length > 10 ? parseFloat(display).toExponential(4) : display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.action}
            className={cn(
              "rounded-xl py-4 text-lg font-mono font-bold transition-all active:scale-95",
              btn.wide && "col-span-2",
              btn.type === "equals" && skin.preview.accent,
              btn.type === "operator" && skin.preview.accent,
              (btn.type === "number" || btn.type === "function") && skin.preview.buttons,
              btn.type === "operator" && "opacity-90",
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function calculate(a: number, b: number, op: Operation): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b !== 0 ? a / b : 0;
    default: return b;
  }
}

function formatResult(value: number): string {
  if (!isFinite(value)) return "Erro";
  const str = String(value);
  if (str.includes(".") && str.split(".")[1].length > 8) {
    return value.toFixed(8).replace(/\.?0+$/, "");
  }
  return str;
}
