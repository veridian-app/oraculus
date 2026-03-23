import { Brain } from "lucide-react";

export const AppNavigation = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 w-full">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Brain className="w-5 h-5 text-violet-400" />
            <span>Oraculus</span>
          </div>
        </div>
      </div>
    </div>
  );
};


