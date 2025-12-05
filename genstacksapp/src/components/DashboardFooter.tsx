import React from "react";

const DashboardFooter: React.FC = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <p className="text-center text-sm md:text-base text-muted-foreground font-sans">
          © {new Date().getFullYear()} Genstacks. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default DashboardFooter;
