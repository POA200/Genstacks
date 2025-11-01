import { Card } from '@/components/ui/card';
import Featureone from '@/assets/Featureone.png';
import Featuretwo from '@/assets/Featuretwo.png';
import Featurethree from '@/assets/Featurethree.png';
import Featureimg from '@/assets/Featureimg.png';
import Featurefour from '@/assets/Featurefour.png';
import Featurefive from '@/assets/Featurefive.png';
import Featuresix from '@/assets/Featuresix.png';

const features = [
  {
    title: 'Intuitive Trait Stacking',
    body:
      'Drag-and-drop your asset folders and define the precise order of image layers (e.g., Background to Body to Accessory). Our system ensures every trait combines perfectly.',
    image: Featureone
  },
  {
    title: 'Precision Rarity Control',
    body:
      'Fine-tune the appearance frequency of every single trait with an intuitive percentage slider. Guaranteeing fairness, rarity, and scarcity across your entire collection.',
    image: Featuretwo
  },
  {
    title: 'Verifiably Fair Generation',
    body:
      'Our backend uses a CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) algorithm, ensuring the final asset composition is truly random and unbiased according to your set rarity rules.',
    image: Featurethree
  },
  {
    title: 'IPFS & Arweave Decentralization',
    body:
      "Never lose your art. After generation, all final images and corresponding metadata files are automatically uploaded and pinned to IPFS/Arweave for permanent, decentralized storage.",
    image: Featurefour
  },
  {
    title: 'Secure Stacks Fee Payment (V1)',
    body:
      'Pay the 50 STX service fee directly on the Stacks Blockchain using a custom Clarity contract. This ensures a transparent, secure, and auditable process to license your final assets.',
    image: Featurefive
  },
  {
    title: 'Future-Proof Minting Gateway',
    body: 
    'Your generated assets are 100% ready for V2. We have built the foundation for direct, integrated on-chain minting, allowing you to launch your collection directly from our platform soon.',
    image: Featuresix
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 lg:py-32 relative px-6 overflow-hidden">
      <div className="absolute left-0 top-2/3 -translate-y-1/2 pointer-events-none">
        <img
          src={Featureimg}
          alt=""
          className="w-[800px] h-auto object-contain"
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 text-primary tracking-wider">
            FEATURES
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <Card
              key={f.title}
              className="bg-gradient-to-br from-primary to-primary backdrop-blur-50 border-2 border-[#00FFFF]/50 text-white shadow-xl"
            >
              <div className="px-6">
                <div className="h-64 w-64 rounded-lg overflow-hidden mb-6">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-8 text-white tracking-wide">
                  {f.title}
                </h3>
                <p className="text-sm md:text-base text-white/80 leading-relaxed">
                  {f.body}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
