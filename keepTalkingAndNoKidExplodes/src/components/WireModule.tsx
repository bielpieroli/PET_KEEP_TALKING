import { useState } from "react"
import { Card } from "./ui/Card"

interface WireModuleProps {
  onDefused: () => void
  onExplode: () => void
  serialNumber: string
  isDefused: boolean
}

export function WireModule({ onDefused, onExplode, serialNumber, isDefused }: WireModuleProps) {
  const [wires] = useState(() => {
    const colors = ["red", "blue", "yellow", "black", "white"]
    const count = 3 + Math.floor(Math.random() * 4) // 3-6 fios
    return Array.from({ length: count }, () => colors[Math.floor(Math.random() * colors.length)])
  })
  
  // Conta fios por cor
  const countWires = (color: string) => wires.filter(w => w === color).length
  
  // Encontra a posição do último fio de uma cor específica
  const findLastWirePosition = (color: string) => {
    for (let i = wires.length - 1; i >= 0; i--) {
      if (wires[i] === color) return i
    }
    return -1
  }
  
  // Verifica se o último dígito do serial é ímpar
  const isLastDigitOdd = () => {
    const lastChar = serialNumber[serialNumber.length - 1]
    return !isNaN(Number(lastChar)) && Number(lastChar) % 2 !== 0
  }
  
  // Determina qual fio deve ser cortado baseado nas regras
  const getCorrectWireToCut = () => {
    const wireCount = wires.length
    const redCount = countWires("red")
    const blueCount = countWires("blue")
    const yellowCount = countWires("yellow")
    const blackCount = countWires("black")
    const whiteCount = countWires("white")
    const lastWireColor = wires[wires.length - 1]
    const lastRedPosition = findLastWirePosition("red")
    const lastBluePosition = findLastWirePosition("blue")
    const serialOdd = isLastDigitOdd()
    
    // Regras para 3 fios
    if (wireCount === 3) {
      if (redCount === 0) return 1 // segundo fio (índice 1)
      if (lastWireColor === "white") return wireCount - 1 // último fio
      if (blueCount > 1) return lastBluePosition // último fio azul
      return wireCount - 1 // último fio
    }
    
    // Regras para 4 fios
    if (wireCount === 4) {
      if (redCount > 1) return lastRedPosition // último fio vermelho
      if (lastWireColor === "yellow" && redCount === 0) return 0 // primeiro fio
      if (blueCount === 1) return 0 // primeiro fio
      if (yellowCount > 1) return wireCount - 1 // último fio
      return 1 // segundo fio
    }
    
    // Regras para 5 fios
    if (wireCount === 5) {
      if (lastWireColor === "black" && !serialOdd) return 3 // quarto fio
      if (redCount === 1 && yellowCount > 1) return 0 // primeiro fio
      if (blackCount === 0) return 1 // segundo fio
      return 0 // primeiro fio
    }
    
    // Regras para 6 fios
    if (wireCount === 6) {
      if (yellowCount === 0 && serialOdd) return 2 // terceiro fio
      if (yellowCount === 1 && whiteCount > 1) return 3 // quarto fio
      if (redCount === 0) return wireCount - 1 // último fio
      return 3 // quarto fio
    }
    
    return -1 // Caso padrão (não deve acontecer)
  }
  
  const correctWire = getCorrectWireToCut()
  
  const handleWireCut = (index: number) => {
    if (isDefused) return
    
    if (index === correctWire) {
      onDefused()
    } else {
      onExplode()
    }
  }
  
  return (
    <Card className="p-6 bg-slate-300">
      <h2 className="text-xl font-bold mb-4 text-center">MÓDULO DE FIOS</h2>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-full h-8 bg-gray-700 rounded-t-lg"></div>
        {wires.map((color, index) => (
          <div key={index} className="flex items-center w-full">
            <div className="w-8 h-8 bg-gray-700 rounded-l-lg"></div>
            <div 
              className={`flex-grow h-2 cursor-pointer ${isDefused ? "opacity-50" : "hover:h-3"}`}
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
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Serial: {serialNumber}</p>
        <p>Fios: {wires.length} | Vermelhos: {countWires("red")} | Azuis: {countWires("blue")}</p>
        <p>Amarelos: {countWires("yellow")} | Pretos: {countWires("black")} | Brancos: {countWires("white")}</p>
      </div>
    </Card>
  )
}