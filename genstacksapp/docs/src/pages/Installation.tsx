import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Installation() {
  const features = [
    {
      title: "Serverless Generation Engine",
      description:
        "NFT composition is executed entirely on Vercel Serverless Functions using Sharp.js for high-speed, parallel image rendering, ensuring low latency and high scalability.",
    },
    {
      title: "Robust Rarity Control",
      description:
        "Collision Handling (Max Retries) to prevent infinite loops and enforces user-defined Exclusion Rules",
    },
    {
      title: "Real-Time Status & UX",
      description:
        "Utilizes a polling mechanism and Shadcn UI components to give users a live progress bar and status updates while the collection is being generated.",
    },
    {
      title: "Metadata & Image Download",
      description:
        "Users pay a 50 STX fee via a Clarity contract call to license and download the final collection ZIP, hosted on Pinata/IPFS.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Key Features
        </h1>
        <p className="text-lg text-muted-foreground font-sans">
          Explore the powerful features that make GENSTACKS a leading NFT
          collection generator
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Platform Features
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 font-sans">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Technology Stack
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Frontend</CardTitle>
              <CardDescription>Client Layer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "TailwindCSS", "Shadcn UI"].map(
                  (tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  )
                )}
              </div>
              <p className="text-sm text-foreground/80 font-sans">
                Wallet connection, trait arrangement, and real-time rarity
                calculation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compute</CardTitle>
              <CardDescription>Serverless Layer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["Vercel Functions", "Node.js", "Sharp.js", "JSZip"].map(
                  (tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  )
                )}
              </div>
              <p className="text-sm text-foreground/80 font-sans">
                High-speed image composition and metadata generation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain</CardTitle>
              <CardDescription>Smart Contracts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["Stacks", "Clarity", "STX"].map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-foreground/80 font-sans">
                Fee collection and payment verification on blockchain.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
