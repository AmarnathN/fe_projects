import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const perks = [
  {
    name: "Instant delivey",
    icon: ArrowDownToLine,
    description:
      "Get your assets deliver within same day and start using then the day you liked.",
  },
  {
    name: "Gauranteed Quality",
    icon: CheckCircle,
    description:
      "Where every asset is verified my our team to ensure the highest quality standards.",
  },

  {
    name: "For the planet",
    icon: Leaf,
    description: "We've pledged 1% sales for saving the planet",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-centre flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your marketplace for high-quality{" "}
            <span className="text-blue-600">assets</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to Next-Store. Where every asset is verified my our team to
            ensure the highest quality standards.
          </p>
          <div className="flex flex-col sm:flex-row mt-6 gap-4">
            <Link href={"/products"} className={buttonVariants()}>
              Browse trending
            </Link>
            <Button variant="ghost">Our quality promise &rarr;</Button>
          </div>
        </div>
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-col sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => {
              return (
                <div
                  key={perk.name}
                  className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
                >
                  <div className="md:flex-shrink-0 flex justify-center">
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                      <perk.icon className="w-1/3 h-1/3"></perk.icon>
                    </div>
                  </div>
                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                    <h3 className="text-bold font-medium text-gray-900">{perk.name}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {perk.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
