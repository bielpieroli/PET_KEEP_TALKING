import { useState, useEffect, useRef } from "react";
import { AlertTriangle, RotateCcw, Book, Clock, Layers } from "lucide-react";
import { Card } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import { WireModule } from "./components/WireModule";
import { ButtonModule } from "./components/ButtonModule";
import { Timer } from "./components/Timer";
import { Manual } from "./components/Manual";
import { ManualPseudo } from "./components/ManualPseudo";
import { ManualScratch } from "./components/ManualScratch";
import explosionSoundFile from "./assets/sounds/explosion.mp3";
import tickSoundFile from "./assets/sounds/clock_tick.mp3";
import victorySoundFile from "./assets/sounds/victory.mp3"; // <-- NOVO

// --- TIPOS ---
type GameState = "menu" | "playing" | "won" | "lost" | "exploded";
type ModuleType = "FIOS" | "BOTÃO";
interface ModuleConfig {
  id: number;
  type: ModuleType;
  defused: boolean;
}

// --- CONSTANTES ---
const TICK_FAST_THRESHOLD = 60;
const TICK_NORMAL_MS = 1000;
const TICK_FAST_MS = 500;

function App() {
  // Estados
  const [gameState, setGameState] = useState<GameState>("menu");
  const [timeLeft, setTimeLeft] = useState(300);
  const [initialTime, setInitialTime] = useState(300);
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [moduleCount, setModuleCount] = useState(3);

  // Manuais
  const [showManualPython, setShowManualPython] = useState(false);
  const [showManualPseudo, setShowManualPseudo] = useState(false);
  const [showManualScratch, setShowManualScratch] = useState(false);

  // Bomba
  const [serialNumber, setSerialNumber] = useState("");

  // Sons
  const [explosionSound] = useState(() => {
    const a = new Audio(explosionSoundFile);
    a.volume = 0.35;
    return a;
  });
  const [tickSound] = useState(() => {
    const a = new Audio(tickSoundFile);
    a.volume = 0.5;
    return a;
  });
  const [victorySound] = useState(() => {
    const a = new Audio(victorySoundFile);
    a.volume = 0.4;
    return a;
  });

  // Tick
  const tickIntervalRef = useRef<number | null>(null);
  const playTick = () => {
    try {
      tickSound.currentTime = 0;
      void tickSound.play();
    } catch {}
  };
  const startTick = (ms: number) => {
    stopTick();
    tickIntervalRef.current = window.setInterval(playTick, ms);
  };
  const stopTick = () => {
    if (tickIntervalRef.current !== null) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
    try {
      tickSound.pause();
      tickSound.currentTime = 0;
    } catch {}
  };

  // Gera dados da bomba
  const generateNewBombData = () => {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();
    const lastDigit = Math.floor(Math.random() * 10).toString();
    setSerialNumber(randomString + lastDigit);
  };

  // Timer
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopTick();
            try {
              explosionSound.currentTime = 0;
              void explosionSound.play();
            } catch {}
            setGameState("lost");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, timeLeft, explosionSound]);

  // Tick automático
  useEffect(() => {
    if (gameState !== "playing" || timeLeft <= 0) {
      stopTick();
      return;
    }
    const ms = timeLeft <= TICK_FAST_THRESHOLD ? TICK_FAST_MS : TICK_NORMAL_MS;
    startTick(ms);
    return () => stopTick();
  }, [gameState, timeLeft]);

  // Vitória
  useEffect(() => {
    if (
      gameState === "playing" &&
      modules.length > 0 &&
      modules.every((m) => m.defused)
    ) {
      stopTick();
      try {
        victorySound.currentTime = 0;
        void victorySound.play();
      } catch {}
      setGameState("won");
    }
  }, [modules, gameState, victorySound]);

  // Explosão manual
  const handleExplosion = () => {
    stopTick();
    try {
      explosionSound.currentTime = 0;
      void explosionSound.play();
    } catch {}
    setGameState("exploded");
  };

  // Helpers
  const generateModules = (count: number): ModuleConfig[] => {
    const types: ModuleType[] = ["FIOS", "BOTÃO"];
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      type: types[Math.floor(Math.random() * types.length)],
      defused: false,
    }));
  };

  const startGame = () => {
    if (initialTime <= 0 || moduleCount <= 0) {
      alert("Defina um tempo e quantidade de módulos válidos!");
      return;
    }
    generateNewBombData();
    setGameState("playing");
    setTimeLeft(initialTime);
    setModules(generateModules(moduleCount));
  };

  const resetGame = () => {
    stopTick();
    setGameState("menu");
    setTimeLeft(initialTime);
    setModules([]);
  };

  const markDefused = (id: number) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, defused: true } : m))
    );
  };

  // --- RENDERIZAÇÃO ---
  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-card">
          <div className="mb-6">
            <AlertTriangle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              DEFUSADOR DE BOMBA
            </h1>
            <p className="text-muted-foreground">
              Baseado em Keep Talking and Nobody Explodes
            </p>
          </div>

          <div className="mb-6 space-y-4 text-left">
            <label className="block text-sm font-medium text-muted-foreground">
              <Clock className="w-4 h-4 inline mr-1" /> Tempo da Missão
              (segundos)
            </label>
            <input
              type="number"
              min={10}
              className="w-full p-2 border rounded bg-background"
              value={initialTime}
              onChange={(e) => setInitialTime(Number(e.target.value))}
            />
            <label className="block text-sm font-medium text-muted-foreground">
              <Layers className="w-4 h-4 inline mr-1" /> Quantidade de Módulos
            </label>
            <input
              type="number"
              min={1}
              className="w-full p-2 border rounded bg-background"
              value={moduleCount}
              onChange={(e) => setModuleCount(Number(e.target.value))}
            />
          </div>

          <div className="space-y-4">
            <Button
              onClick={startGame}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              INICIAR MISSÃO
            </Button>
            <Button
              onClick={() => setShowManualPseudo(true)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Book className="w-4 h-4 mr-2" /> MANUAL EM PSEUDOCÓDIGO
            </Button>
            <Button
              onClick={() => setShowManualPython(true)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Book className="w-4 h-4 mr-2" /> MANUAL EM PYTHON
            </Button>
            <Button
              onClick={() => setShowManualScratch(true)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Book className="w-4 h-4 mr-2" /> MANUAL EM SCRATCH
            </Button>
          </div>
        </Card>

        {showManualPseudo && (
          <ManualPseudo onClose={() => setShowManualPseudo(false)} />
        )}
        {showManualPython && (
          <Manual onClose={() => setShowManualPython(false)} />
        )}
        {showManualScratch && (
          <ManualScratch onClose={() => setShowManualScratch(false)} />
        )}
      </div>
    );
  }

  if (gameState === "won") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-green-500 bg-card">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              BOMBA DEFUSADA!
            </h1>
            <p className="text-muted-foreground">
              Parabéns! Você salvou o dia!
            </p>
          </div>
          <Button
            onClick={resetGame}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> NOVA MISSÃO
          </Button>
        </Card>
      </div>
    );
  }

  if (gameState === "exploded") {
    return (
      <div className="min-h-screen bg-red-950 flex items-center justify-center p-4 animate-pulse">
        <Card className="max-w-md w-full p-8 text-center bg-red-900 border-2 border-red-500">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <span className="text-2xl text-white">💥</span>
            </div>
            <h1 className="text-3xl font-bold text-red-400 mb-2">EXPLOSÃO!</h1>
            <p className="text-red-200">
              Você cometeu um erro em um dos módulos!
            </p>
          </div>
          <Button
            onClick={resetGame}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> TENTAR NOVAMENTE
          </Button>
        </Card>
      </div>
    );
  }

  if (gameState === "lost") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-primary bg-card">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-danger">
              <span className="text-2xl text-primary-foreground">⏰</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              TEMPO ESGOTADO!
            </h1>
            <p className="text-muted-foreground">
              O tempo acabou. Tente novamente!
            </p>
          </div>
          <Button
            onClick={resetGame}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> TENTAR NOVAMENTE
          </Button>
        </Card>
      </div>
    );
  }

  // Tela de jogo
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            DISPOSITIVO EXPLOSIVO ATIVO
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="text-xl text-foreground">
              NÚMERO DA BOMBA:{" "}
              <span className="text-foreground text-red-400">
                {serialNumber}
              </span>
            </span>
          </div>
        </div>

        <div className="sticky top-0 z-50 bg-background py-2 shadow-md">
          <Timer timeLeft={timeLeft} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-slate-300 rounded-lg p-4 shadow-lg"
            >
              {module.type === "FIOS" && (
                <WireModule
                  onDefused={() => markDefused(module.id)}
                  onExplode={handleExplosion}
                  serialNumber={serialNumber}
                  isDefused={module.defused}
                />
              )}
              {module.type === "BOTÃO" && (
                <ButtonModule
                  onDefused={() => markDefused(module.id)}
                  onExplode={handleExplosion}
                  isDefused={module.defused}
                  timeLeft={timeLeft}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {modules.map((m) => (
              <span
                key={m.id}
                className={`px-3 py-1 rounded ${
                  m.defused
                    ? "bg-green-500 text-white"
                    : "bg-slate-300 text-muted-foreground"
                }`}
              >
                {m.type.toUpperCase()}: {m.defused ? "DEFUSADO" : "ATIVO"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
