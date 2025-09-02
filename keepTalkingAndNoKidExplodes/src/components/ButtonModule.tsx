import { useState } from "react"
import { Card } from "./ui/Card"

interface ButtonModuleProps {
  onDefused: () => void
  onExplode: () => void
  serialNumber: string
  isDefused: boolean
  batteries: number
}

export function ButtonModule({ onDefused, onExplode, serialNumber, isDefused, batteries }: ButtonModuleProps) {
  const [buttonColor] = useState(() => {
    const colors = ["red", "blue", "yellow", "white"]
    return colors[Math.floor(Math.random() * colors.length)]
  })
  
  const [buttonText] = useState(() => {
    const texts = ["Detonate", "Abort", "Hold", "Press"]
    return texts[Math.floor(Math.random() * texts.length)]
  })
  
  const handleButtonPress = () => {
    if (isDefused) return
    
    // Lógica simplificada para o botão
    const hasVowel = /[AEIOU]/.test(serialNumber)
    const shouldHold = buttonColor === "blue" && buttonText === "Abort"
    const shouldPress = batteries > 2 && buttonText === "Detonate"
    
    if (shouldHold || shouldPress) {
      onDefused()
    } else {
      onExplode()
    }
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">MÓDULO DE BOTÃO</h2>
      <div className="flex justify-center">
        <button
          className={`w-32 h-32 rounded-full border-4 border-gray-300 flex items-center justify-center text-white font-bold text-lg ${isDefused ? "opacity-50" : "hover:opacity-80 cursor-pointer"}`}
          style={{ backgroundColor: buttonColor }}
          onClick={handleButtonPress}
          disabled={isDefused}
        >
          {buttonText}
        </button>
      </div>
      <div className="mt-4 text-sm text-muted-foreground text-center">
        <p>Serial: {serialNumber}</p>
        <p>Baterias: {batteries}</p>
        <p>Instrução: Pressione ou segure com base no manual</p>
      </div>
    </Card>
  )
}