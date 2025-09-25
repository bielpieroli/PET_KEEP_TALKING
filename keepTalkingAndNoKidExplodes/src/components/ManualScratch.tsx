import { X } from "lucide-react";
import { Card } from "./ui/Card";
import fios1 from "./../assets/fios1.png";
import fios2 from "./../assets/fios2.png";
import fios3 from "./../assets/fios3.png";
import fios4 from "./../assets/fios4.png";
import botao from "./../assets/botao.png";

interface ManualProps {
  onClose: () => void;
}

export function ManualScratch({ onClose }: ManualProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justsey-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">MANUAL DE DEFUSAGEM</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-3 text-red-600">
              Módulo de Fios
            </h3>
            <p className="mb-3">
              O módulo consiste em 3 a 6 fios coloridos. Apenas um fio deve ser
              cortado para desativar o módulo.
            </p>
          </div>
          <h1>QUANTIDADE_DE_FIOS = 3</h1>
          <img src={fios1}></img>
          <h1>QUANTIDADE_DE_FIOS = 4</h1>
          <img src={fios2}></img>
          <h1>QUANTIDADE_DE_FIOS = 5</h1>
          <img src={fios3}></img>
          <h1>QUANTIDADE_DE_FIOS = 6</h1>
          <img src={fios4}></img>

          <div className="border-t pt-4">
            <h3 className="text-xl font-bold mb-3 text-blue-600">
              Módulo de Botão
            </h3>
            <p className="mb-3">
              O módulo possui um botão grande, uma luz colorida com uma sigla,
              além de uma faixa de luz. Primeiramente, verseique se o botão deve
              ser apenas clicado e solto imediatamento, ou se ele deve ficar
              pressionado e solto no momento adequado: aquele quando o timer
              contiver o número desejado.
            </p>
            <img src={botao} className="h-[800px] w-auto object-cover"></img>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-2">Geral</h3>
            <p>Todos os módulos devem ser desativados para vencer o jogo.</p>
            <p className="font-semibold text-red-600">
              Cuidado com o tempo! Se acabar, a bomba explode.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
