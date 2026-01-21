import { Palette, User, Briefcase, GraduationCap, Wrench, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type MobileSection = 'versions' | 'template' | 'personal' | 'experience' | 'education' | 'skills';

interface BottomNavigationProps {
  activeSection: MobileSection;
  onSectionChange: (section: MobileSection) => void;
  completedSections: Record<Exclude<MobileSection, 'versions'>, boolean>;
}

const navItems = [
  { id: 'versions' as MobileSection, icon: FolderOpen, label: 'Versions' },
  { id: 'template' as MobileSection, icon: Palette, label: 'Style' },
  { id: 'personal' as MobileSection, icon: User, label: 'Profil' },
  { id: 'experience' as MobileSection, icon: Briefcase, label: 'Expérience' },
  { id: 'education' as MobileSection, icon: GraduationCap, label: 'Formation' },
  { id: 'skills' as MobileSection, icon: Wrench, label: 'Compétences' },
];

export function BottomNavigation({
  activeSection,
  onSectionChange,
  completedSections,
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="grid grid-cols-6 min-w-max h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isCompleted = item.id !== 'versions' && completedSections[item.id as keyof typeof completedSections];

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 transition-all relative px-3',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {/* Completion indicator */}
                {isCompleted && !isActive && (
                  <div className="absolute top-2 right-1/2 translate-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                )}

                {/* Icon */}
                <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                
                {/* Label */}
                <span className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}