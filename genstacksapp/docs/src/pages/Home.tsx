import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Layers, Zap, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="relative flex w-full justify-center px-3 sm:px-5">
      <div className="w-full max-w-7xl px-4 sm:px-6">
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            GENSTACKS
          </h1>
          <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl font-sans">
            Decentralized NFT Collection Generator on Stacks Blockchain. Create,
            customize, and generate unique NFT collections with ease.
          </p>
          <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10 font-sans">
            <Link to="/docs">
              <Button size="lg" className="cursor-pointer">
                Documentation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid gap-6 py-8 md:grid-cols-3 md:py-12">
          <Card>
            <CardHeader>
              <Layers className="h-10 w-10 text-primary" />
              <CardTitle>Layer-based Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans">
                Create complex NFT collections using a powerful layer-based
                approach with full control over trait composition.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary" />
              <CardTitle>Serverless & Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans">
                Powered by Vercel Serverless Functions with Sharp.js for
                high-speed parallel image rendering and composition.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-primary" />
              <CardTitle>Blockchain Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="font-sans">
                Entire process is verifiable via Stacks Blockchain with smart
                contract-based payment and licensing.
              </CardDescription>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
