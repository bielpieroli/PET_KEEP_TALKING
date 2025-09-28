import { X } from "lucide-react";
import { Card } from "./ui/Card";

interface ManualProps {
  onClose: () => void;
}

export function ManualPseudo({ onClose }: ManualProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justsey-center p-4 z-50">
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

            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4">
              {`# Para 3 fios:
se quantidade_fios == 3:
  se quantidade_vermelhos == 0:
    corte_o_fio = 2
  senão se ultimo_fio == "branco":
    corte_o_fio = 3
  senão se quantidade_azuis > 1:
    corte_o_fio = ultimo_azul
  senão:
    corte_o_fio = 3

# Para 4 fios:
se quantidade_fios == 4:
  se quantidade_vermelhos > 1: 
    corte_o_fio = ultimo_vermelho
  senão se ultimo_fio == "amarelo" e quantidade_vermelhos == 0:
    corte_o_fio = 1
  senão se quantidade_azuis == 1:
    corte_o_fio = 1
  senão se quantidade_amarelos > 1:
    corte_o_fio = 4
  senão:
    corte_o_fio = 2

# Para 5 fios:
se quantidade_fios == 5:
  se ultimo_fio == "preto" e ultimo_numero_da_bomba é PAR:
    corte_o_fio = 4
  senão se quantidade_vermelhos == 1 e quantidade_amarelos > 1:
    corte_o_fio = 1
  senão se quantidade_pretos == 0:
    corte_o_fio = 2
  senão:
    corte_o_fio = 1

# Para 6 fios:
se quantidade_fios == 6:
  se quantidade_amarelos == 0 e ultimo_numero_da_bomba é ÍMPAR:
    corte_o_fio = 3
  senão se quantidade_amarelos == 1 e quantidade_brancos > 1:
    corte_o_fio = 4
  senão se quantidade_vermelhos == 0:
    corte_o_fio = 6
  senão:
    corte_o_fio = 4`}
            </pre>
          </div>

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

            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4">
              {`# Verifique se deve pressionar o botão ou apenas clicar
se LED == "azul" e sigla == "CAR":
    acao = "de_um_clique_no_botao"
senão se cor_botao == "branco" e sigla == "BOB":
    acao = "de_um_clique_no_botao"
senão se LED == "amarela" e sigla == "FRK":
    acao = "de_um_clique_no_botao"
senão:
    
    acao = "fique_segurando_o_botao"
     houver no timer
    se faixa == "azul":
       solte_o_botao_quando_o_tempo_ter_o_numero = 4
    senão se faixa == "branca":
       solte_o_botao_quando_o_tempo_ter_o_numero = 2
    senão
       solte_o_botao_quando_o_tempo_ter_o_numero = 1`}
            </pre>
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
