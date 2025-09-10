import { X } from "lucide-react"
import { Card } from "./ui/Card"

interface ManualProps {
  onClose: () => void
}

export function Manual({ onClose }: ManualProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">MANUAL DE DEFUSAGEM</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-3 text-red-600">Módulo de Fios</h3>
            <p className="mb-3">O módulo consiste em 3 a 6 fios coloridos. Apenas um fio deve ser cortado para desativar o módulo.</p>
            
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4">
{`# Para 3 fios:
if quantidade_fios == 3:
  if vermelho == 0:
    corte = 2
  elif ultimo_fio == "branco":
    corte = 3
  elif azul > 1:
    corte = ultimo_azul
  else:
    corte = 3

# Para 4 fios:
if quantidade_fios == 4:
  if vermelho > 1: 
    corte = ultimo_vermelho
  elif ultimo_fio == "amarelo" and vermelho == 0:
    corte = 1
  elif azul == 1:
    corte = 1
  elif amarelo > 1:
    corte = 4
  else:
    corte = 2

# Para 5 fios:
if quantidade_fios == 5:
  if ultimo_fio == "preto" and ultimoDigitoSerial % 2 == 0:
    corte = 4
  elif vermelho == 1 and amarelo > 1:
    corte = 1
  elif preto == 0:
    corte = 2
  else:
    corte = 1

# Para 6 fios:
if quantidade_fios == 6:
  if amarelo == 0 and ultimoDigitoSerial % 2 == 1:
    corte = 3
  elif amarelo == 1 and branco > 1:
    corte = 4
  elif vermelho == 0:
    corte = 6
  else:
    corte = 4`}
            </pre>
            
            <p className="text-sm text-muted-foreground">
              Nota: Os fios são numerados de cima para baixo (1 é o mais alto).<br/>
              serial_impar: True se o último dígito do número de série for ímpar.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-xl font-bold mb-3 text-blue-600">Módulo de Botão</h3>
            <p className="mb-3">O módulo possui um botão grande e uma luz colorida com uma sigla.</p>
            
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4">
{`# Verifique se deve pressionar e soltar imediatamente
if luz == "azul" and sigla == "CAR":
    acao = "pressione_e_solte"
elif cor_botao == "branco" and indicador_CAR_aceso == True:
    acao = "pressione_e_solte"
elif baterias > 2 and luz == "vermelha":
    acao = "pressione_e_solte"
elif luz == "amarela" and indicador_FRK_apagado == True:
    acao = "pressione_e_solte"
else:
    # Caso contrário, mantenha pressionado
    if faixa == "azul":
        liberar_em = 4
    elif faixa == "amarela":
        liberar_em = 5
    elif faixa == "vermelha":
        liberar_em = 1
    elif faixa == "verde":
        liberar_em = 3
    elif faixa == "branca":
        liberar_em = 2`}
            </pre>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-2">Variáveis Disponíveis</h3>
            <pre className="bg-muted p-3 rounded-md overflow-x-auto text-xs">
{`quantidade_fios      # Número total de fios (3-6)
vermelho            # Quantidade de fios vermelhos
azul               # Quantidade de fios azuis
amarelo            # Quantidade de fios amarelos
branco             # Quantidade de fios brancos
preto              # Quantidade de fios pretos
ultimo_fio         # Cor do último fio
ultimo_vermelho    # Posição do último fio vermelho
ultimo_azul        # Posição do último fio azul
serial_impar       # True se último dígito do serial for ímpar

luz                # Cor da luz (azul, vermelha, amarela)
sigla              # Sigla ao lado do botão (CAR, FRK, SIG, NSA)
cor_botao          # Cor do botão
baterias           # Número de baterias na bomba
indicador_CAR_aceso    # True se houver indicador CAR aceso
indicador_FRK_apagado  # True se houver indicador FRK apagado
faixa              # Cor da faixa (azul, amarela, vermelha, verde, branca)`}
            </pre>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-2">Geral</h3>
            <p>Ambos os módulos devem ser desativados para vencer o jogo.</p>
            <p className="font-semibold text-red-600">Cuidado com o tempo! Se acabar, a bomba explode.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}