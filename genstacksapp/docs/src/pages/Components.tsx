import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Cpu,
  Lock,
  Settings,
  Activity,
  BadgeCheck,
} from "lucide-react";

export function Components() {
  return (
    <div className="space-y-6 px-3 sm:px-5">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Architecture
        </h1>
        <p className="text-lg text-muted-foreground font-sans">
          GENSTACKS is built on a modern, scalable architecture using serverless
          computing and blockchain technology.
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          System Architecture
        </h2>
        <div className="space-y-6 md:grid md:grid-cols-1 md:gap-6 md:space-y-0">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Frontend Layer</CardTitle>
              </div>
              <CardDescription>Client Application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind CSS"].map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-sans">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-foreground/80 font-sans">
                Interactive web interface for collection creation, trait
                arrangement, rarity configuration, and real-time status
                tracking.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Compute Layer</CardTitle>
              </div>
              <CardDescription>Serverless Functions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["Vercel Functions", "Node.js", "Sharp.js"].map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-sans">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-foreground/80 font-sans">
                High-performance NFT image composition engine with parallel
                processing and IPFS/Pinata integration for asset storage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Blockchain Layer</CardTitle>
              </div>
              <CardDescription>Smart Contracts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {["Stacks", "Clarity", "STX"].map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-sans">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-foreground/80 font-sans">
                Secure payment processing with fee collection contracts and
                blockchain verification for collection ownership and licensing.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Key Components
        </h2>
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <Settings className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardTitle>
              <h3 className="font-semibold text-foreground pl-6">
                Rarity Control Engine
              </h3>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-foreground/80 font-sans">
                Advanced collision handling with max retry limits and
                user-defined exclusion rules to prevent duplicate trait
                combinations.
              </p>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
               <Activity className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardTitle>
              <h3 className="font-semibold text-foreground pl-6">
                Real-Time Status System
              </h3>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-foreground/80 font-sans">
                Polling mechanism with live progress updates and status tracking
                for collection generation process.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BadgeCheck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardTitle>
              <h3 className="font-semibold text-foreground pl-6">
                Payment & Licensing
              </h3>
            </CardTitle>
            <CardContent>
              <p className="text-sm text-foreground/80 font-sans">
                50 STX fee via Clarity smart contracts with fraud prevention and
                duplicate payment mitigation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
