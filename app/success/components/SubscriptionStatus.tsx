import { Bell, DollarSign, LockKeyholeOpen } from "lucide-react";

export const SubscriptionStatus = () => {
  return (
    <div className="relative flex justify-between items-start mb-10 pt-4 xs:items-center">
      <div className="absolute left-[1%] right-[1%] sm:left-[3%] sm:right-[3%] md:left-[6%] md:right-[6%] lg:left-[12%] lg:right-[12%] top-10 h-6 bg-blue-100 -translate-y-1/2 mx-16">
        <div className="h-full bg-[#0051D1/10] w-1/2 rounded-full"></div>
      </div>

      <Step icon={<LockKeyholeOpen />} label="Contratação" active />
      <Step icon={<Bell />} label="Último dia grátis" />
      <Step icon={<DollarSign />} label="Cobrança" />
    </div>
  );
};

const Step = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <div className="text-center w-1/3 z-10">
    <div
      className={`w-12 h-12 flex items-center justify-center mx-auto rounded-full mb-2 ${
        active ? "bg-[#0051D1] text-white shadow-lg" : "bg-[#7EADF2] text-white"
      }`}
    >
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </div>
);
