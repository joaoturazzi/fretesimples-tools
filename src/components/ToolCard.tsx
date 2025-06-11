
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  gradient: string;
  onSelect: (toolId: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  id,
  title,
  description,
  icon,
  category,
  gradient,
  onSelect
}) => {
  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-0 overflow-hidden">
      <CardContent className="p-0">
        <div className={cn("h-32 flex items-center justify-center relative", gradient)}>
          <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div className="absolute top-3 right-3 text-xs font-medium text-white/90 bg-white/20 px-2 py-1 rounded-full">
            {category}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>
          <Button 
            onClick={() => onSelect(id)}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
          >
            Usar Ferramenta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
