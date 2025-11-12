import Image from "next/image";

export function AcceptedBrands() {
  const brands = [
    { name: "Visa", src: "/visa.svg" },
    { name: "Mastercard", src: "/mastercard.svg" },
    { name: "Elo", src: "/elo.svg" },
    { name: "dinnersClub", src: "/dinnersclub.svg" },
    { name: "Amex", src: "/americanexpress.svg" },
  ];

  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-sm font-normal">Bandeiras aceitas</p>
      <div className="flex gap-3">
        {brands.map((b) => (
          <Image key={b.name} src={b.src} alt={b.name} width={27} height={20} />
        ))}
      </div>
    </div>
  );
}
