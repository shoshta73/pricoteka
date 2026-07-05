import { BuildingsIcon, PackageIcon, StorefrontIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@pricoteka/ui-core/card";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

function Website() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <section className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-8">
        <header className="flex items-center justify-between gap-4">
          <a className="text-lg font-semibold tracking-tight" href="/">
            Pricoteka
          </a>
        </header>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium text-primary">Pricing intelligence for local catalogs</p>
              <h1 className="max-w-3xl text-5xl leading-tight font-semibold tracking-tight text-balance md:text-7xl">
                Build a searchable library of prices.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Pricoteka helps you keep track of everyday product prices from the stores you visit, so it is easier to
                notice what changed and compare before you buy.
              </p>
            </div>
          </div>

          <Card className="overflow-hidden border-primary/20 bg-card/70 shadow-2xl shadow-primary/10">
            <CardContent className="space-y-5 p-6">
              <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                <StorefrontIcon className="size-10" />
              </div>
              <div className="grid gap-3">
                <PreviewRow icon={<StorefrontIcon />} label="Stores tracked" value="24" />
                <PreviewRow icon={<BuildingsIcon />} label="Offices tracked" value="48" />
                <PreviewRow icon={<PackageIcon />} label="Products tracked" value="1,280" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

function PreviewRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-background/70 p-4">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="text-primary [&_svg]:size-5">{icon}</span>
        {label}
      </div>
      <strong className="text-xl font-semibold">{value}</strong>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Website />
  </StrictMode>,
);
