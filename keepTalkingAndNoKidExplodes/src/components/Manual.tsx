import { X } from "lucide-react"
import { Card } from "./ui/Card"

interface ManualProps {
  onClose: () => void
}

export function Manual({ onClose }: ManualProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">MANUAL DE DEFUSAGEM</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">Módulo de Fios</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Se o último dígito do serial for par, corte o primeiro fio</li>
              <li>Se houver mais de um fio vermelho, corte o segundo fio</li>
              <li>Se o último dígito do serial for ímpar, corte o terceiro fio</li>
              <li>Se o quarto fio for azul, corte-o</li>
              <li>Se não houver fios pretos, corte o quinto fio</li>
              <li>Se o sexto fio for branco, corte-o</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-2">Módulo de Botão</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Se o botão for azul e disser "Abort", segure o botão</li>
              <li>Se houver mais de 2 baterias e o botão disser "Detonate", pressione e solte</li>
              <li>Caso contrário, a bomba explodirá</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-2">Geral</h3>
            <p>Ambos os módulos devem ser desativados para vencer o jogo.</p>
            <p>Cuidado com o tempo! Se acabar, você perde.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}