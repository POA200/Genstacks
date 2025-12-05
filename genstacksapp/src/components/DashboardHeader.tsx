import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  stxAddress: string;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  stxAddress,
  onLogout,
}) => {
  return (
    <header className="flex justify-between items-center p-6 md:p-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <h2 className="text-2xl md:text-3xl font-bold tracking-wider text-primary">
        GENSTACKS
      </h2>
      <div className="flex items-center gap-3 md:gap-4">
        <Badge variant="secondary" className="font-sans text-xs md:text-sm">
          {stxAddress.substring(0, 5)}...{stxAddress.slice(-4)}
        </Badge>
        <Button variant="outline" onClick={onLogout} size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          <span className="font-sans">Disconnect</span>
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
