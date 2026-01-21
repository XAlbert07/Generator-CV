import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="px-4 pb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">
          Progression
        </span>
        <span className={cn(
          'text-xs font-semibold',
          progress === 100 ? 'text-green-600' : 'text-primary'
        )}>
          {progress}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            progress === 100 ? 'bg-green-600' : 'bg-primary'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}