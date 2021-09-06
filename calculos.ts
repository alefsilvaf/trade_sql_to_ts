import { addMonths } from 'date-fns';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

interface DadosTaxa {
  id: number;
  id_estabelecimento: number;
  valor_taxa: number;
  valor_inicial: number;
  valor_final: number;
  ativo: number;
}

interface tipoRetorno {
  valorFinal: number;
  valorParcela: number;
  valorTaxa: number;
}

export function calculoTaxa(
  diaMes: number,
  ValorSolicitado: number,
  TaxaJuros: DadosTaxa[],
  NumeroParcelas: number,
  Periodicidade: number
) {
  let taxaValor = 0;
  TaxaJuros.map(function (row: DadosTaxa) {
    if (ValorSolicitado <= row.valor_final && ValorSolicitado >= row.valor_inicial) {
      taxaValor = row.valor_taxa;
    }
  });

  const Vencimentos = [];
  const Diferenca = [];
  const TaxaCalculo = taxaValor / 100;
  let somaValorTotal = 0;
  const hoje = new Date();
  let j = 0,
    meses = Periodicidade;

  let ValorFinalSimulacao = (ValorSolicitado / NumeroParcelas) * (1 + TaxaCalculo);

  while (somaValorTotal < ValorSolicitado) {
    ValorFinalSimulacao = ValorFinalSimulacao + 10;
    somaValorTotal = 0;
    j = 1;
    meses = Periodicidade;
    while (j <= NumeroParcelas) {
      Vencimentos[j] = addMonths(hoje.setDate(diaMes), meses);
      meses = meses + Periodicidade;
      Diferenca[j] = differenceInCalendarDays(Vencimentos[j], hoje);
      somaValorTotal =
        somaValorTotal +
        ValorFinalSimulacao -
        ValorFinalSimulacao * (TaxaCalculo / 30) * Diferenca[j];
      j++;
    }
  }

  while (somaValorTotal > ValorSolicitado) {
    ValorFinalSimulacao = ValorFinalSimulacao - 0.01;
    somaValorTotal = 0;
    j = 1;
    meses = Periodicidade;
    while (j <= NumeroParcelas) {
      Vencimentos[j] = addMonths(hoje.setDate(diaMes), meses);
      meses = meses + Periodicidade;
      Diferenca[j] = differenceInCalendarDays(Vencimentos[j], hoje);
      somaValorTotal =
        somaValorTotal +
        ValorFinalSimulacao -
        ValorFinalSimulacao * (TaxaCalculo / 30) * Diferenca[j];
      j++;
    }
  }

  ValorFinalSimulacao = ValorFinalSimulacao + 0.01;
  const retorno: tipoRetorno = {
    valorParcela: Math.round(ValorFinalSimulacao * 100) / 100,
    valorFinal: (Math.round(ValorFinalSimulacao * 100) / 100) * NumeroParcelas,
    valorTaxa: taxaValor,
  };

  return retorno;
}
