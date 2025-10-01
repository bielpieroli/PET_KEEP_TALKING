import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/Card";
import button_click from "./../assets/sounds/button_click.mp3";

// Interfaces e Props continuam iguais...
interface ButtonModuleProps {
  onDefused: () => void;
  onExplode: () => void;
  isDefused: boolean;
  //batteries: number;
  timeLeft: number;
}

export function ButtonModule({
  onDefused,
  onExplode,
  isDefused,
  //batteries,
  timeLeft,
}: ButtonModuleProps) {
  // Configuração inicial do botão (seu código aqui já era ótimo!)
  const [buttonConfig] = useState(() => {
    const lightColors = ["blue", "red", "yellow", "white", "green"];
    const labels = ["CAR", "FRK", "SIG", "NSA", "BOB", "MSA", "TRN"];
    const stripColors = ["blue", "red", "yellow", "white", "black", "green"];
    const buttonColors = ["blue", "red", "yellow", "white", "black", "green"];
    const buttonTexts = [
      "Detonate",
      "Abort",
      "Hold",
      "Press",
      "Push",
      "Button",
    ];
    return {
      lightColor: lightColors[Math.floor(Math.random() * lightColors.length)],
      label: labels[Math.floor(Math.random() * labels.length)],
      stripColor: stripColors[Math.floor(Math.random() * stripColors.length)],
      buttonColor:
        buttonColors[Math.floor(Math.random() * buttonColors.length)],
      buttonText: buttonTexts[Math.floor(Math.random() * buttonTexts.length)],
    };
  });

  const [buttonState, setButtonState] = useState<"idle" | "pressed">("idle");
  const [currentTimerDigits, setCurrentTimerDigits] = useState("");

  // MUDANÇA 1: Otimizar a criação do áudio.
  // Criamos o objeto de áudio apenas uma vez e o guardamos no estado.
  const [clickSound] = useState(() => {
    const audio = new Audio(button_click);
    audio.volume = 0.1;
    return audio;
  });

  // MUDANÇA 2: Guardar a referência do timer para poder limpá-lo.
  const pressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Efeito para atualizar os dígitos do timer (seu código original)
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    setCurrentTimerDigits(
      `${minutes.toString().padStart(2, "0")}${seconds
        .toString()
        .padStart(2, "0")}`
    );
  }, [timeLeft]);

  // MUDANÇA 2 (cont.): Efeito para limpar o timeout quando o componente desmontar.
  useEffect(() => {
    // A função retornada pelo useEffect é a "função de limpeza".
    return () => {
      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }
    };
  }, []); // O array vazio [] garante que isso só rode na montagem e desmontagem.

  // Regras do manual (sem alterações)
  const shouldReleaseImmediately = () => {
    const cond1 =
      buttonConfig.lightColor === "blue" && buttonConfig.label === "CAR";
    const cond2 =
      buttonConfig.buttonColor === "white" && buttonConfig.label === "BOB";
    //const cond3 = batteries > 2 && buttonConfig.lightColor === "red";
    const cond4 =
      buttonConfig.lightColor === "yellow" && buttonConfig.label === "FRK";
    return cond1 || cond2 /*|| cond3*/ || cond4;
  };

  const getTargetDigit = () => {
    switch (buttonConfig.stripColor) {
      case "blue":
        return "4";
      case "white":
        return "2";
      default:
        return "1";
    }
  };

  // Botão pressionado
  const handlePress = () => {
    if (isDefused) return;
    clickSound.play(); // Toca o som ao pressionar
    setButtonState("pressed");

    if (shouldReleaseImmediately()) {
      // MUDANÇA 2 (cont.): Guardamos o ID do timeout na nossa referência.
      pressTimeoutRef.current = setTimeout(() => {
        console.log(
          "[DEBUG] Botão mantido pressionado quando deveria ser solto → EXPLODE"
        );
        onExplode();
      }, 1000);
    }
  };

  // Botão solto
  const handleRelease = () => {
    if (isDefused || buttonState !== "pressed") return;

    // MUDANÇA 2 (cont.): Limpamos o timeout imediatamente ao soltar o botão.
    // Se o usuário soltar antes de 1s, a explosão é cancelada.
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
    }

    if (shouldReleaseImmediately()) {
      console.log("[DEBUG] Immediate Release → DEFUSED");
      onDefused();
    } else {
      const targetDigit = getTargetDigit();
      const hasTargetDigit = currentTimerDigits.includes(targetDigit);

      console.log(
        "[DEBUG] Botão solto. Timer:",
        currentTimerDigits,
        "→ precisa conter:",
        targetDigit,
        "→",
        hasTargetDigit
      );

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

  // MUDANÇA 3: Função auxiliar para as classes do botão.
  const getButtonClasses = () => {
    if (isDefused) {
      return "opacity-50 cursor-not-allowed";
    }
    if (buttonState === "pressed") {
      return "animate-pulse scale-105 border-orange-500";
    }
    return "hover:opacity-90 hover:scale-105 cursor-pointer active:scale-95 border-gray-300";
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
            LED | NOME DO BOTÃO: {buttonConfig.label}
          </span>
        </div>

        {/* Botão */}
        <button
          className={`w-32 h-32 rounded-full border-4 flex items-center justify-center font-bold text-lg shadow-lg transition-all ${getButtonClasses()}`} // MUDANÇA 3
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
