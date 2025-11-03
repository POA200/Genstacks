import GenstacksLogo from '../assets/GenstacksLogo.png';
import { Button } from './ui/button';
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from 'react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // --- MAIN NAVBAR CONTENT ---
  return (
    <>
      <div className="flex items-center justify-between py-4 md:py-6 lg:py-8 px-4 md:px-8 lg:px-12 bg-secondary/20 backdrop-blur-sm border-b border-primary 
      fixed top-0 w-full z-50">
        <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('hero')}>
          <img src={GenstacksLogo} alt="Genstacks Logo" className="h-8 md:h-10 mr-2 rounded-full" />
          <span className="text-xl md:text-2xl lg:text-3xl text-foreground font-md tracking-wider">Genstacks</span>
        </div>
        
        {/* Desktop Menu */}
        <div className='hidden md:flex justify-center items-center space-x-4'>
          <Button 
            className="rounded-lg text-lg lg:text-2xl tracking-wider" 
            variant={'link'} 
            size={'lg'}
            onClick={() => scrollToSection('hero')}
          >
            HOME
          </Button>
          <Button 
            className="rounded-lg text-lg lg:text-2xl tracking-wider" 
            variant={'link'} 
            size={'lg'}
            onClick={() => scrollToSection('about')}
          >
            ABOUT
          </Button>
          <Button 
            className="rounded-lg text-lg lg:text-2xl tracking-wider" 
            variant={'link'} 
            size={'lg'}
            onClick={() => scrollToSection('features')}
          >
            FEATURES
          </Button>
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-0">
          <ModeToggle />
          <Button
            variant="ghost"
            className="p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-[44px] w-full bg-secondary/10 backdrop-blur-lg border-b border-primary/50 z-40 py-8">
          <div className="flex flex-col items-center space-y-4">
            <Button 
              className="rounded-lg text-xl tracking-wider w-full" 
              variant={'link'} 
              size={'lg'}
              onClick={() => scrollToSection('hero')}
            >
              HOME
            </Button>
            <Button 
              className="rounded-lg text-xl tracking-wider w-full" 
              variant={'link'} 
              size={'lg'}
              onClick={() => scrollToSection('about')}
            >
              ABOUT
            </Button>
            <Button 
              className="rounded-lg text-xl tracking-wider w-full" 
              variant={'link'} 
              size={'lg'}
              onClick={() => scrollToSection('features')}
            >
              FEATURES
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;