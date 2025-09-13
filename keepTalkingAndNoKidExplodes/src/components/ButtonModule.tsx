import { useState, useEffect, useRef } from "react"
import { Card } from "./ui/Card"

interface ButtonModuleProps {
  onDefused: () => void
  onExplode: () => void
  isDefused: boolean
  batteries: number
  timeLeft: number
}

export function ButtonModule({ onDefused, onExplode, isDefused, batteries, timeLeft }: ButtonModuleProps) {
  const [buttonConfig] = useState(() => {
    const lightColors = ["blue", "red", "yellow", "white", "green"];
    const labels = ["CAR", "FRK", "SIG", "NSA", "BOB", "MSA", "TRN"];
    const stripColors = ["blue", "yellow", "red", "green", "white"];
    const buttonColors = ["blue", "red", "yellow", "white", "black", "green"];
    const buttonTexts = ["Detonate", "Abort", "Hold", "Press", "Push", "Button"];
    
    return {
      lightColor: lightColors[Math.floor(Math.random() * lightColors.length)],
      label: labels[Math.floor(Math.random() * labels.length)],
      stripColor: stripColors[Math.floor(Math.random() * stripColors.length)],
      buttonColor: buttonColors[Math.floor(Math.random() * buttonColors.length)],
      buttonText: buttonTexts[Math.floor(Math.random() * buttonTexts.length)],
    };
  });

  const [buttonState, setButtonState] = useState<"idle" | "pressed">("idle");
  const [currentTimerDigits, setCurrentTimerDigits] = useState("");
  const isPressedRef = useRef(false); // Referência para verificar se ainda está pressionado

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    setCurrentTimerDigits(`${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`);
  }, [timeLeft]);

  // Regras do manual
  const shouldReleaseImmediately = () => {
    const cond1 = (buttonConfig.lightColor === "blue" && buttonConfig.label === "CAR");
    const cond2 = (buttonConfig.buttonColor === "white" && buttonConfig.label === "BOB");
    const cond3 = (batteries > 2 && buttonConfig.lightColor === "red");
    const cond4 = (buttonConfig.lightColor === "yellow" && buttonConfig.label === "FRK");

    return cond1 || cond2 || cond3 || cond4;
  };

  const getTargetDigit = () => {
    switch (buttonConfig.stripColor) {
      case "blue": return "4";
      case "yellow": return "5";
      case "red": return "1";
      case "green": return "3";
      case "white": return "2";
      default: return "0";
    }
  };

  // Botão pressionado
  const handlePress = () => {
    if (isDefused) return;
    console.log("[DEBUG] Botão pressionado.");
    setButtonState("pressed");
    isPressedRef.current = true;

    // Se deveria soltar imediatamente, configuramos um timeout para explodir se mantido pressionado
    if (shouldReleaseImmediately()) {
      setTimeout(() => {
        // Verificar usando a referência se ainda está pressionado
        if (isPressedRef.current && !isDefused) {
          console.log("[DEBUG] Botão mantido pressionado quando deveria ser solto imediatamente → EXPLODE");
          onExplode();
          setButtonState("idle");
          isPressedRef.current = false;
        }
      }, 1000); // Explode após 1 segundo se mantido pressionado
    }
  };

  // Botão solto
  const handleRelease = () => {
    if (isDefused) return;
    
    // Atualizar a referência primeiro
    isPressedRef.current = false;
    
    if (buttonState !== "pressed") return;

    if (shouldReleaseImmediately()) {
      console.log("[DEBUG] Immediate Release → DEFUSED");
      onDefused();
    } else {
      const targetDigit = getTargetDigit();
      const hasTargetDigit = currentTimerDigits.includes(targetDigit);

      console.log("[DEBUG] Botão solto.");
      console.log("Timer:", currentTimerDigits, "→ precisa conter:", targetDigit, "→", hasTargetDigit);

      if (hasTargetDigit) {
        onDefused();
      } else {
        onExplode();
      }
    }

    setButtonState("idle");
  };

  const getTextColor = () => {
    const darkColors = ["blue", "red", "green", "black"];
    return darkColors.includes(buttonConfig.buttonColor) ? "white" : "black";
  };


  return (
    <Card className="p-6 bg-slate-300">
      <h2 className="text-xl font-bold mb-4 text-center">MÓDULO DE BOTÃO</h2>
      
      <div className="flex flex-col items-center space-y-4">
        {/* LED + Sigla */}
        <div className="flex items-center space-x-2 mb-2">
          <div 
            className="w-8 h-8 rounded-full shadow-md"
            style={{ backgroundColor: buttonConfig.lightColor }}
          />
          <span className="font-mono text-lg font-semibold bg-slate-300 px-2 py-1 rounded">
            LED | Sigla: {buttonConfig.label}
          </span>
        </div>
        
        {/* Botão */}
        <button
          className={`w-32 h-32 rounded-full border-4 flex items-center justify-center font-bold text-lg shadow-lg transition-all ${
            isDefused 
              ? "opacity-50 cursor-not-allowed" 
              : buttonState === "pressed" 
                ? "animate-pulse scale-105 border-orange-500" 
                : "hover:opacity-90 hover:scale-105 cursor-pointer active:scale-95 border-gray-300"
          }`}
          style={{ 
            backgroundColor: buttonConfig.buttonColor,
            color: getTextColor(),
          }}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
          disabled={isDefused}
        >
          {buttonState === "pressed" ? "..." : buttonConfig.buttonText}
        </button>
        
        {/* Faixa de luz */}
        <div className="w-full flex items-center justify-center mt-2">
          <div>
            <p className="text-xs text-muted-foreground">Faixa de luz: </p>
          </div>
          <div 
            className="w-4/5 h-4 rounded-full shadow-inner"
            style={{ backgroundColor: buttonConfig.stripColor }}
          />
        </div>
      </div>
    </Card>
  );
}