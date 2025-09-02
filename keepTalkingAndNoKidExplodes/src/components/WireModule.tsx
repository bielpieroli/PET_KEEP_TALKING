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
    return Array.from({ length: 6 }, () => colors[Math.floor(Math.random() * colors.length)])
  })
  
  const handleWireCut = (index: number) => {
    if (isDefused) return
    
    // Lógica simplificada para decidir se o fio deve ser cortado
    const lastDigit = parseInt(serialNumber[serialNumber.length - 1])
    const shouldCut = (index === 0 && lastDigit % 2 === 0) || 
                     (index === 1 && wires.filter(w => w === "red").length > 1) ||
                     (index === 2 && lastDigit % 2 !== 0) ||
                     (index === 3 && wires[index] === "blue") ||
                     (index === 4 && wires.filter(w => w === "black").length === 0) ||
                     (index === 5 && wires[index] === "white")
    
    if (shouldCut) {
      onDefused()
    } else {
      onExplode()
    }
  }
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">MÓDULO DE FIOS</h2>
      <div className="grid grid-cols-3 gap-4">
        {wires.map((color, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-16 h-16 rounded-full border-4 border-gray-300 cursor-pointer ${isDefused ? "opacity-50" : "hover:opacity-80"}`}
              style={{ backgroundColor: color }}
              onClick={() => handleWireCut(index)}
            />
            <span className="mt-2 text-sm">{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Serial: {serialNumber}</p>
        <p>Instrução: Corte os fios com base no manual</p>
      </div>
    </Card>
  )
}