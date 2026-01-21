import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingPreviewButtonProps {
  onClick: () => void;
}

export function FloatingPreviewButton({ onClick }: FloatingPreviewButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
    >
      <Eye className="w-6 h-6" />
    </Button>
  );
}