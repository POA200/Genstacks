import React from 'react';
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
    title: 'Intuitive Layer Composition',
    body:
      'Visually define how your traits stack. Simply drag and drop your uploaded folders to set the exact order — from the background base to the final special-effect layer. No coding required.',
    image: Featureone
  },
  {
    title: 'Precision Rarity Control',
    body:
      'Assign exact probability percentages to every single trait within a layer (eg. 5% rare gold chain, 95% common silver chain). Our system ensures 100% distribution balance for accurate randomization.',
    image: Featuretwo
  },
  {
    title: 'Mint-Ready Metadata Export',
    body:
      'Generate thousands of images? No problem. We automatically create and include all the necessary JSON metadata files for your collection, correctly linking each NFT to its corresponding image hash and index.',
    image: Featurethree
  },
  {
    title: 'Iterative Visual Review',
    body:
      "Don't pay until you're satisfied. Our engine generates a live sample of your collection, allowing you to preview the randomization and rarity effects before finalizing the payment and download.",
    image: Featurefour
  },
  {
    title: 'Scalable Backend Performance',
    body:
      'Built on Node.js and the sharp image engine, GENSTACKS handles collections from 100 to 100,000+ images quickly. Minimal waiting time means you can focus on creativity, not computation bottlenecks.',
    image: Featurefive
  },
  {
    title: 'Secure Clarity Payment Gate',
    body: 'Your STX fee is processed through a Clarity smart contract. This ensures on-chain transaction guarantees and instant, immutable unlock of assets upon confirmation.',
    image: Featuresix
  }
];

const Features = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative px-6 overflow-hidden">
      <div className="absolute left-0 top-2/3 -translate-y-1/2 pointer-events-none">
        <img
          src={Featureimg}
          alt=""
          className="w-[800px] h-auto object-contain"
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 text-white tracking-wider">
            FEATURES
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <Card
              key={f.title}
              className="bg-gradient-to-br from-[#4035BF] to-[#4035BF]/50 border-2 border-[#00FFFF]/50 text-white shadow-xl"
            >
              <div className="px-6">
                <div className="h-80 w-full rounded-lg overflow-hidden mb-6">
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
