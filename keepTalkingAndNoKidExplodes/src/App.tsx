import { useState, useEffect } from "react"
import { AlertTriangle, RotateCcw, Book, Clock } from "lucide-react"
import { Card } from "./components/ui/Card"
import { Button } from "./components/ui/Button"
import { WireModule } from "./components/WireModule"
import { ButtonModule } from "./components/ButtonModule"
import { Timer } from "./components/Timer"
import { Manual } from "./components/Manual"

type GameState = "menu" | "playing" | "won" | "lost" | "exploded"

function App() {
  const [gameState, setGameState] = useState<GameState>("menu")
  const [timeLeft, setTimeLeft] = useState(300)
  const [initialTime, setInitialTime] = useState(300)
  const [showManual, setShowManual] = useState(false)
  const [wiresDefused, setWiresDefused] = useState(false)
  const [buttonDefused, setButtonDefused] = useState(false)
  const [serialNumber] = useState(() => {
  const randomString = Math.random().toString(36).substring(2, 7).toUpperCase();
    const lastDigit = Math.floor(Math.random() * 10).toString();
    return randomString + lastDigit;
});
  const [batteries] = useState(() => Math.floor(Math.random() * 4) + 1)

  // Timer logic
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState("lost")
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState, timeLeft])

  // Check win condition
  useEffect(() => {
    if (wiresDefused && buttonDefused && gameState === "playing") {
      setGameState("won")
    }
  }, [wiresDefused, buttonDefused, gameState])

  const handleExplosion = () => {
    setGameState("exploded")
  }

  const startGame = () => {
    setGameState("playing")
    setTimeLeft(initialTime)
    setWiresDefused(false)
    setButtonDefused(false)
  }

  const resetGame = () => {
    setGameState("menu")
    setTimeLeft(initialTime)
    setWiresDefused(false)
    setButtonDefused(false)
  }

  const timePresets = [
    { label: "1 min", value: 60 },
    { label: "3 min", value: 180 },
    { label: "5 min", value: 300 },
    { label: "10 min", value: 600 },
  ]

  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-primary">
          <div className="mb-6">
            <AlertTriangle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">DEFUSADOR DE BOMBA</h1>
            <p className="text-muted-foreground">Baseado em Keep Talking and Nobody Explodes</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tempo da Missão</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {timePresets.map((preset) => (
                <Button
                  key={preset.value}
                  onClick={() => setInitialTime(preset.value)}
                  variant={initialTime === preset.value ? "default" : "outline"}
                  size="sm"
                  className="text-sm"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={startGame}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              INICIAR MISSÃO
            </Button>

            <Button onClick={() => setShowManual(true)} variant="outline" className="w-full" size="lg">
              <Book className="w-4 h-4 mr-2" />
              MANUAL DE DEFUSAGEM
            </Button>
          </div>
        </Card>

        {showManual && <Manual onClose={() => setShowManual(false)} />}
      </div>
    )
  }

  if (gameState === "won") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-green-500">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">BOMBA DEFUSADA!</h1>
            <p className="text-muted-foreground">Parabéns! Você salvou o dia!</p>
          </div>

          <Button
            onClick={resetGame}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            NOVA MISSÃO
          </Button>
        </Card>
      </div>
    )
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
            <p className="text-red-200">Você cortou o fio errado ou pressionou o botão incorretamente!</p>
          </div>

          <Button onClick={resetGame} className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            TENTAR NOVAMENTE
          </Button>
        </Card>
      </div>
    )
  }

  if (gameState === "lost") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-2 border-primary">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-danger">
              <span className="text-2xl text-primary-foreground">⏰</span>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">TEMPO ESGOTADO!</h1>
            <p className="text-muted-foreground">O tempo acabou. Tente novamente!</p>
          </div>

          <Button
            onClick={resetGame}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            TENTAR NOVAMENTE
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">DISPOSITIVO EXPLOSIVO ATIVO</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>SERIAL: {serialNumber}</span>
            <span>BATERIAS: {batteries}</span>
          </div>
        </div>

        {/* Timer */}
        <Timer timeLeft={timeLeft} />

        {/* Modules */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <WireModule
            onDefused={() => setWiresDefused(true)}
            onExplode={handleExplosion}
            serialNumber={serialNumber}
            isDefused={wiresDefused}
          />

          <ButtonModule
            onDefused={() => setButtonDefused(true)}
            onExplode={handleExplosion}
            serialNumber={serialNumber}
            isDefused={buttonDefused}
            batteries={batteries}
          />
        </div>

        {/* Status */}
        <div className="mt-6 text-center">
          <div className="flex justify-center gap-4 text-sm">
            <span
              className={`px-3 py-1 rounded ${wiresDefused ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              FIOS: {wiresDefused ? "DEFUSADO" : "ATIVO"}
            </span>
            <span
              className={`px-3 py-1 rounded ${buttonDefused ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              BOTÃO: {buttonDefused ? "DEFUSADO" : "ATIVO"}
            </span>
          </div>
        </div>
      </div>

      {showManual && <Manual onClose={() => setShowManual(false)} />}
    </div>
  )
}

export default App