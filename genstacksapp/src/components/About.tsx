import React from 'react';
import Logo from '@/assets/Genstacks.png';
import TopAccent from '@/assets/Topaboutimg.png';
import BottomAccent from '@/assets/Bottomaboutimg.png';
import { cn } from '@/lib/utils';

const About: React.FC = () => {
  return (
    <section id="about" className={cn('w-full bg-transparent relative py-12 md:py-20 lg:py-28')}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Decorative background accents positioned behind content */}
          <img
            src={TopAccent}
            alt="about accent top"
            className="pointer-events-none select-none absolute top-0 left-0 w-100 md:w-120 lg:w-200 -translate-x-0 -translate-y-20 z-0"
          />
          <img
            src={BottomAccent}
            alt="about accent bottom"
            className="pointer-events-none select-none absolute bottom-0 right-0 w-100 md:w-120 lg:w-200 translate-x-1 translate-y-30 z-0"
          />
          {/* Image: on small screens it appears first (on top), on larger screens it is left */}
          <div className="order-1 md:order-1 flex justify-center md:justify-start z-10">
            <img
              src={Logo}
              alt="Genstacks Logo"
              className="w-64 md:w-100 lg:w-150 object-contain drop-shadow-lg"
            />
          </div>

          {/* Text: on small screens appears below image */}
          <div className="order-2 md:order-2 text-center md:text-left z-10">
            <h3 className="text-lg md:text-2xl lg:text-4xl text-primary font-medium mb-2 tracking-wide">
              Create, Customize, Own. The Ultimate Stacks NFT Generator.
            </h3>
            <p className="text-md md:text-lg lg:text-2xl text-foreground leading-relaxed font-sans">
              GENSTACKS is the first decentralized application built on Stacks to give creators full control over their generative art collection. Forget complex scripting and manual uploads. Simply upload your traits, set your rarity percentages using our intuitive UI, and instantly generate up to 10,000 unique NFT assets. Pay a small fee to secure your decentralized files and metadata, ready to mint on the Stacks blockchain when you are.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
