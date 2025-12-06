import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function Components() {
  return (
    <div className="space-y-6">
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
        <div className="space-y-6 md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frontend Layer</CardTitle>
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
              <CardTitle className="text-lg">Compute Layer</CardTitle>
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
              <CardTitle className="text-lg">Blockchain Layer</CardTitle>
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
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">
                Rarity Control Engine
              </h3>
              <p className="text-sm text-foreground/80 font-sans">
                Advanced collision handling with max retry limits and
                user-defined exclusion rules to prevent duplicate trait
                combinations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">
                Real-Time Status System
              </h3>
              <p className="text-sm text-foreground/80 font-sans">
                Polling mechanism with live progress updates and status tracking
                for collection generation process.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">
                Payment & Licensing
              </h3>
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
