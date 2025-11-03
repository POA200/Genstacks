import React from 'react';
import { Button } from '@/components/ui/button';
import BottomHeroimg from '@/assets/BottomHeroimg.png';
import { useAuthStore } from '@/store/authStore';

const BottomHero: React.FC = () => {
	const connectWallet = useAuthStore((s) => s.connectWallet);
	const isAuth = useAuthStore((s) => s.isAuth);
	const setShowDashboard = useAuthStore((s) => s.setShowDashboard);

	const handleButtonClick = () => {
		if (isAuth) {
			setShowDashboard(true);
			return;
		}
		connectWallet();
	};

	return (
		<section id="bottom-hero" className="relative py-12 md:py-16 lg:py-20">
			{/* Content with background image overlay */}
			<div className="relative z-10 max-w-4xl mx-auto px-6">
				{/* Background gradient image */}
				<div className="absolute inset-0 -top-30 md:-top-30 lg:-top-50 pointer-events-none select-none overflow-hidden">
					<img
						src={BottomHeroimg}
						alt=""
						className="w-full object-cover"
					/>
				</div>

				<div className="relative border-2 border-primary rounded-xl p-8 md:p-12 lg:p-18 bg-secondary shadow-lg">
					<h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-center mb-4 tracking-wide">
						Ready to Launch Your NFT Collection?
					</h3>
					<p className="text-sm md:text-base lg:text-lg text-foreground/80 text-center mb-6 font-sans">
						Go from idea to a fully generated, rarity-controlled, and IPFS-ready collection in minutes. Start creating your decentralized legacy today on Stacks.
					</p>

					<div className="flex items-center justify-center">
						<Button
							className="rounded-lg px-6 py-6 text-sm md:text-base lg:text-lg tracking-wide"
							size="lg"
							onClick={handleButtonClick}
						>
							{isAuth ? 'Continue to Dashboard' : 'Start Generating Now'}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default BottomHero;
