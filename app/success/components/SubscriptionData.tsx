type SubscriptionDataProps = {
  formattedCpf: string;
  installmentDisplay: string;
  modalidade: string;
  cardLastFour: string;
  valueDisplay: string;
};

export const SubscriptionData = ({
  formattedCpf,
  installmentDisplay,
  modalidade,
  cardLastFour,
  valueDisplay,
}: SubscriptionDataProps) => {
  return (
    <div className="bg-[#FAFAFA] p-8 border rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4">Dados da contratação</h3>
      <div className="w-full flex flex-col md:flex-row gap-8 justify-between">
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 md:w-2/4 text-sm">
          <div className="flex flex-col space-y-4">
            <DataRow label="CPF" value={formattedCpf} />
            <DataRow label="Método" value="Cartão de crédito" />
            <DataRow label="Parcelamento" value={installmentDisplay} />
          </div>

          <div className="flex flex-col space-y-4">
            <DataRow label="Modalidade" value={modalidade} />
            <DataRow label="Número cartão" value={`**** **** **** ${cardLastFour}`} />
            <DataRow label="Valor" value={valueDisplay} />
          </div>
        </div>

        <InfoTexts />
      </div>
    </div>
  );
};

const DataRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between flex-col lg:flex-row">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const InfoTexts = () => (
  <div className="md:w-2/5 text-sm space-y-4">
    <p className="text-sm">Enviamos um e-mail de confirmação com todos os dados da sua contratação.</p>
    <p className="text-sm">
      Foi feita uma pré-autorização para validar seu cartão, que logo será cancelada. No fim do período de teste é feita
      a cobrança definitiva e sua assinatura fica ativa.
    </p>
    <p className="text-muted-foreground text-xs">
      *Após o pagamento do plano, a renovação automática fica ativa com a recorrência contratada. Valores promocionais
      não têm recorrência e não serão aplicados na renovação.
    </p>
  </div>
);
