import { useState } from "react";
import { Card } from "./ui/Card";
// MELHORIA: Sugiro renomear ou trocar este som por um de "corte" no futuro
import wireCutSoundFile from "./../assets/sounds/cut.mp3";

interface WireModuleProps {
  onDefused: () => void;
  onExplode: () => void;
  serialNumber: string;
  isDefused: boolean;
}

export function WireModule({
  onDefused,
  onExplode,
  serialNumber,
  isDefused,
}: WireModuleProps) {
  // Geração dos fios (seu código original, está ótimo)
  const [wires] = useState(() => {
    const colors = ["red", "blue", "yellow", "black", "white"];
    const count = 3 + Math.floor(Math.random() * 4); // 3-6 fios
    return Array.from(
      { length: count },
      () => colors[Math.floor(Math.random() * colors.length)]
    );
  });

  // MELHORIA: Otimização do áudio para o corte do fio
  const [wireCutSound] = useState(() => {
    const audio = new Audio(wireCutSoundFile);
    audio.volume = 0.2;
    return audio;
  });

  // CORREÇÃO: Removi todo o bloco de código incorreto (useRef, useEffect, etc.) מכאן

  // --- Funções Auxiliares ---

  const countWires = (color: string) => wires.filter((w) => w === color).length;

  // REFINAMENTO: Usando o método nativo `lastIndexOf` que é mais simples e eficiente
  const findLastWirePosition = (color: string) => wires.lastIndexOf(color);

  // REFINAMENTO: Versão mais concisa da função
  const isLastDigitOdd = () => {
    const lastDigit = parseInt(serialNumber.slice(-1));
    return !isNaN(lastDigit) && lastDigit % 2 !== 0;
  };

  const getCorrectWireToCut = () => {
    const wireCount = wires.length;
    const redCount = countWires("red");
    const blueCount = countWires("blue");
    const yellowCount = countWires("yellow");
    const blackCount = countWires("black");
    const whiteCount = countWires("white");
    const lastWireColor = wires[wireCount - 1];
    const serialOdd = isLastDigitOdd();

    if (wireCount === 3) {
      if (redCount === 0) return 1; // segundo fio
      if (lastWireColor === "white") return wireCount - 1; // último
      if (blueCount > 1) return findLastWirePosition("blue"); // último azul
      return wireCount - 1; // último
    }
    if (wireCount === 4) {
      if (redCount > 1 && serialOdd) return findLastWirePosition("red"); // último vermelho
      if (lastWireColor === "yellow" && redCount === 0) return 0; // primeiro
      if (blueCount === 1) return 0; // primeiro
      if (yellowCount > 1) return wireCount - 1; // último
      return 1; // segundo
    }
    if (wireCount === 5) {
      if (lastWireColor === "black" && serialOdd) return 3; // quarto
      if (redCount === 1 && yellowCount > 1) return 0; // primeiro
      if (blackCount === 0) return 1; // segundo
      return 0; // primeiro
    }
    if (wireCount === 6) {
      if (yellowCount === 0 && serialOdd) return 2; // terceiro
      if (yellowCount === 1 && whiteCount > 1) return 3; // quarto
      if (redCount === 0) return wireCount - 1; // último
      return 3; // quarto
    }
    return -1; // Fallback
  };

  const correctWire = getCorrectWireToCut();

  const handleWireCut = (index: number) => {
    if (isDefused) return;

    // MELHORIA: Tocar o som sempre que um fio for cortado
    wireCutSound.play();

    if (index === correctWire) {
      onDefused();
    } else {
      onExplode();
    }
  };

  return (
    <Card className="p-6 bg-slate-300">
      <h2 className="text-xl font-bold mb-4 text-center">MÓDULO DE FIOS</h2>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-full h-8 bg-gray-700 rounded-t-lg"></div>
        {wires.map((color, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="w-8 h-8 bg-gray-700 rounded-l-lg"></div>
            <div
              className={`flex-grow h-2 transition-all ${
                isDefused
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:h-3 cursor-pointer"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleWireCut(index)}
            />
            <div className="w-8 h-8 bg-gray-700 rounded-r-lg flex items-center justify-center">
              <span className="text-white text-xs">{index + 1}</span>
            </div>
          </div>
        ))}
        <div className="w-full h-8 bg-gray-700 rounded-b-lg"></div>
      </div>
      <div className="mt-4 text-xs text-muted-foreground opacity-70">
        <p>Serial: {serialNumber}</p>
        <p>Fios: {wires.join(", ")}</p>
      </div>
    </Card>
  );
}
