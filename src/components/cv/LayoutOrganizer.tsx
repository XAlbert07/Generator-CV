import * as React from "react";
import type { CVData, CVSectionId } from "@/types/cv";
import { defaultSectionOrder } from "@/types/cv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, RotateCcw, Layers, Briefcase, GraduationCap, Sparkles, Languages, ChevronUp, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type LayoutOrganizerProps = {
  cvData: CVData;
  onCvDataChange: (data: CVData) => void;
  sectionOrder: CVSectionId[];
  onSectionOrderChange: (order: CVSectionId[]) => void;
  targetRole: string;
  onTargetRoleChange: (value: string) => void;
  className?: string;
};

const SECTION_META: Record<CVSectionId, { label: string; icon: React.ReactNode }> = {
  summary: { label: "Résumé", icon: <Layers className="h-4 w-4" /> },
  experience: { label: "Expérience", icon: <Briefcase className="h-4 w-4" /> },
  education: { label: "Formation", icon: <GraduationCap className="h-4 w-4" /> },
  skills: { label: "Compétences", icon: <Sparkles className="h-4 w-4" /> },
  languages: { label: "Langues", icon: <Languages className="h-4 w-4" /> },
};

function safeOverId(event: DragEndEvent): string | null {
  return event.over?.id ? String(event.over.id) : null;
}

// Version mobile avec boutons Up/Down
function MobileSortableRow({
  id,
  label,
  leading,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  className,
}: {
  id: string;
  label: React.ReactNode;
  leading?: React.ReactNode;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-card px-3 py-3 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {leading}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{label}</div>
        </div>
      </div>
      
      {/* Boutons Up/Down - Grande zone tactile */}
      <div className="flex flex-col gap-1 shrink-0">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className={cn(
            "p-2 rounded border touch-manipulation",
            "active:bg-accent transition-colors",
            isFirst 
              ? "opacity-30 cursor-not-allowed" 
              : "hover:bg-accent cursor-pointer"
          )}
          aria-label="Monter"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className={cn(
            "p-2 rounded border touch-manipulation",
            "active:bg-accent transition-colors",
            isLast 
              ? "opacity-30 cursor-not-allowed" 
              : "hover:bg-accent cursor-pointer"
          )}
          aria-label="Descendre"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

// Version desktop avec drag handle amélioré
function DesktopSortableRow({
  id,
  label,
  leading,
  className,
}: {
  id: string;
  label: React.ReactNode;
  leading?: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-card px-3 py-3 shadow-sm",
        "transition-all duration-200",
        isDragging && "opacity-60 ring-2 ring-primary/30 shadow-xl scale-[1.02] z-50",
        className
      )}
    >
      <button
        type="button"
        className={cn(
          "p-2 -ml-1 text-muted-foreground hover:text-foreground",
          "cursor-grab active:cursor-grabbing",
          "hover:bg-accent/50 rounded transition-colors"
        )}
        aria-label="Déplacer"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {leading}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{label}</div>
        </div>
      </div>
    </div>
  );
}

function MobileList({
  ids,
  renderRow,
  onReorder,
}: {
  ids: string[];
  renderRow: (id: string, index: number, total: number) => React.ReactNode;
  onReorder: (fromIndex: number, toIndex: number) => void;
}) {
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < ids.length) {
      onReorder(index, newIndex);
    }
  };

  return (
    <div className="space-y-2">
      {ids.map((id, index) => (
        <div key={id}>
          {renderRow(id, index, ids.length)}
        </div>
      ))}
    </div>
  );
}

function DesktopList({
  ids,
  renderRow,
  onReorder,
}: {
  ids: string[];
  renderRow: (id: string) => React.ReactNode;
  onReorder: (activeId: string, overId: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { 
        distance: 8,
        delay: 100,
        tolerance: 5
      } 
    }),
    useSensor(TouchSensor, { 
      activationConstraint: { 
        delay: 250,
        tolerance: 5
      } 
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const activeId = String(event.active.id);
        const overId = safeOverId(event);
        if (!overId || activeId === overId) return;
        onReorder(activeId, overId);
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">{ids.map((id) => renderRow(id))}</div>
      </SortableContext>
    </DndContext>
  );
}

export function LayoutOrganizer({
  cvData,
  onCvDataChange,
  sectionOrder,
  onSectionOrderChange,
  targetRole,
  onTargetRoleChange,
  className,
}: LayoutOrganizerProps) {
  const isMobile = useIsMobile();
  
  const normalizedSectionOrder = React.useMemo<CVSectionId[]>(
    () =>
      (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
        (s): s is CVSectionId => s in SECTION_META
      ),
    [sectionOrder]
  );

  const sectionIds = normalizedSectionOrder.map(String);

  const reorderArrayById = <T extends { id: string }>(arr: T[], activeId: string, overId: string) => {
    const oldIndex = arr.findIndex((x) => x.id === activeId);
    const newIndex = arr.findIndex((x) => x.id === overId);
    if (oldIndex === -1 || newIndex === -1) return arr;
    return arrayMove(arr, oldIndex, newIndex);
  };

  const moveArrayByIndex = <T,>(arr: T[], fromIndex: number, toIndex: number) => {
    return arrayMove(arr, fromIndex, toIndex);
  };

  return (
    <div className={cn("form-section space-y-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="cv-section-title">Organisation & priorité</h3>
          <p className="text-sm text-muted-foreground">
            {isMobile 
              ? "Utilise les flèches pour réorganiser les éléments"
              : "Réorganise par glisser-déposer"
            }
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSectionOrderChange(defaultSectionOrder)}
          className="shrink-0"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Réinitialiser</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="targetRole">Poste visé (optionnel)</Label>
          <Input
            id="targetRole"
            value={targetRole ?? ""}
            onChange={(e) => onTargetRoleChange(e.target.value)}
            placeholder="Ex: Développeur Full‑Stack"
          />
        </div>
      </div>

      <Tabs defaultValue="sections" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="experience">Expériences</TabsTrigger>
            <TabsTrigger value="education">Formation</TabsTrigger>
            <TabsTrigger value="skills">Compétences</TabsTrigger>
            <TabsTrigger value="languages">Langues</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="sections" className="mt-4">
          {isMobile ? (
            <MobileList
              ids={sectionIds}
              renderRow={(id, index, total) => {
                const sectionId = id as CVSectionId;
                const meta = SECTION_META[sectionId];
                return (
                  <MobileSortableRow
                    key={id}
                    id={id}
                    leading={<span className="text-muted-foreground">{meta.icon}</span>}
                    label={meta.label}
                    onMoveUp={() => {
                      const newOrder = moveArrayByIndex(normalizedSectionOrder, index, index - 1);
                      onSectionOrderChange(newOrder);
                    }}
                    onMoveDown={() => {
                      const newOrder = moveArrayByIndex(normalizedSectionOrder, index, index + 1);
                      onSectionOrderChange(newOrder);
                    }}
                    isFirst={index === 0}
                    isLast={index === total - 1}
                  />
                );
              }}
              onReorder={(from, to) => {
                const newOrder = moveArrayByIndex(normalizedSectionOrder, from, to);
                onSectionOrderChange(newOrder);
              }}
            />
          ) : (
            <DesktopList
              ids={sectionIds}
              renderRow={(id) => {
                const sectionId = id as CVSectionId;
                const meta = SECTION_META[sectionId];
                return (
                  <DesktopSortableRow
                    key={id}
                    id={id}
                    leading={<span className="text-muted-foreground">{meta.icon}</span>}
                    label={meta.label}
                  />
                );
              }}
              onReorder={(activeId, overId) => {
                const oldIndex = sectionIds.indexOf(activeId);
                const newIndex = sectionIds.indexOf(overId);
                if (oldIndex === -1 || newIndex === -1) return;
                const next = arrayMove(normalizedSectionOrder, oldIndex, newIndex);
                onSectionOrderChange(next);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="experience" className="mt-4">
          {cvData.experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ajoute au moins une expérience pour la réorganiser.
            </p>
          ) : isMobile ? (
            <MobileList
              ids={cvData.experiences.map((e) => e.id)}
              renderRow={(id, index, total) => {
                const exp = cvData.experiences.find((x) => x.id === id);
                return (
                  <MobileSortableRow
                    key={id}
                    id={id}
                    leading={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                    label={exp ? `${exp.position || "Poste"} — ${exp.company || "Entreprise"}` : "Expérience"}
                    onMoveUp={() => {
                      const next = moveArrayByIndex(cvData.experiences, index, index - 1);
                      onCvDataChange({ ...cvData, experiences: next });
                    }}
                    onMoveDown={() => {
                      const next = moveArrayByIndex(cvData.experiences, index, index + 1);
                      onCvDataChange({ ...cvData, experiences: next });
                    }}
                    isFirst={index === 0}
                    isLast={index === total - 1}
                  />
                );
              }}
              onReorder={(from, to) => {
                const next = moveArrayByIndex(cvData.experiences, from, to);
                onCvDataChange({ ...cvData, experiences: next });
              }}
            />
          ) : (
            <DesktopList
              ids={cvData.experiences.map((e) => e.id)}
              renderRow={(id) => {
                const exp = cvData.experiences.find((x) => x.id === id);
                return (
                  <DesktopSortableRow
                    key={id}
                    id={id}
                    leading={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                    label={exp ? `${exp.position || "Poste"} — ${exp.company || "Entreprise"}` : "Expérience"}
                  />
                );
              }}
              onReorder={(activeId, overId) => {
                const next = reorderArrayById(cvData.experiences, activeId, overId);
                onCvDataChange({ ...cvData, experiences: next });
              }}
            />
          )}
        </TabsContent>

        {/* Répéter la même logique pour education, skills, languages */}
        <TabsContent value="education" className="mt-4">
          {cvData.education.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoute une formation pour la réorganiser.</p>
          ) : (
            isMobile ? (
              <MobileList
                ids={cvData.education.map((e) => e.id)}
                renderRow={(id, index, total) => {
                  const edu = cvData.education.find((x) => x.id === id);
                  return (
                    <MobileSortableRow
                      key={id}
                      id={id}
                      leading={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                      label={edu ? `${edu.degree || "Diplôme"} — ${edu.school || "Établissement"}` : "Formation"}
                      onMoveUp={() => {
                        const next = moveArrayByIndex(cvData.education, index, index - 1);
                        onCvDataChange({ ...cvData, education: next });
                      }}
                      onMoveDown={() => {
                        const next = moveArrayByIndex(cvData.education, index, index + 1);
                        onCvDataChange({ ...cvData, education: next });
                      }}
                      isFirst={index === 0}
                      isLast={index === total - 1}
                    />
                  );
                }}
                onReorder={(from, to) => {}}
              />
            ) : (
              <DesktopList
                ids={cvData.education.map((e) => e.id)}
                renderRow={(id) => {
                  const edu = cvData.education.find((x) => x.id === id);
                  return (
                    <DesktopSortableRow
                      key={id}
                      id={id}
                      leading={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                      label={edu ? `${edu.degree || "Diplôme"} — ${edu.school || "Établissement"}` : "Formation"}
                    />
                  );
                }}
                onReorder={(activeId, overId) => {
                  const next = reorderArrayById(cvData.education, activeId, overId);
                  onCvDataChange({ ...cvData, education: next });
                }}
              />
            )
          )}
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          {cvData.skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoute une compétence.</p>
          ) : (
            isMobile ? (
              <MobileList
                ids={cvData.skills.map((s) => s.id)}
                renderRow={(id, index, total) => {
                  const skill = cvData.skills.find((x) => x.id === id);
                  return (
                    <MobileSortableRow
                      key={id}
                      id={id}
                      leading={<Sparkles className="h-4 w-4 text-muted-foreground" />}
                      label={skill?.name || "Compétence"}
                      onMoveUp={() => {
                        const next = moveArrayByIndex(cvData.skills, index, index - 1);
                        onCvDataChange({ ...cvData, skills: next });
                      }}
                      onMoveDown={() => {
                        const next = moveArrayByIndex(cvData.skills, index, index + 1);
                        onCvDataChange({ ...cvData, skills: next });
                      }}
                      isFirst={index === 0}
                      isLast={index === total - 1}
                    />
                  );
                }}
                onReorder={(from, to) => {}}
              />
            ) : (
              <DesktopList
                ids={cvData.skills.map((s) => s.id)}
                renderRow={(id) => {
                  const skill = cvData.skills.find((x) => x.id === id);
                  return (
                    <DesktopSortableRow
                      key={id}
                      id={id}
                      leading={<Sparkles className="h-4 w-4 text-muted-foreground" />}
                      label={skill?.name || "Compétence"}
                    />
                  );
                }}
                onReorder={(activeId, overId) => {
                  const next = reorderArrayById(cvData.skills, activeId, overId);
                  onCvDataChange({ ...cvData, skills: next });
                }}
              />
            )
          )}
        </TabsContent>

        <TabsContent value="languages" className="mt-4">
          {cvData.languages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoute une langue.</p>
          ) : (
            isMobile ? (
              <MobileList
                ids={cvData.languages.map((l) => l.id)}
                renderRow={(id, index, total) => {
                  const lang = cvData.languages.find((x) => x.id === id);
                  return (
                    <MobileSortableRow
                      key={id}
                      id={id}
                      leading={<Languages className="h-4 w-4 text-muted-foreground" />}
                      label={lang ? `${lang.name || "Langue"} — ${lang.level || ""}` : "Langue"}
                      onMoveUp={() => {
                        const next = moveArrayByIndex(cvData.languages, index, index - 1);
                        onCvDataChange({ ...cvData, languages: next });
                      }}
                      onMoveDown={() => {
                        const next = moveArrayByIndex(cvData.languages, index, index + 1);
                        onCvDataChange({ ...cvData, languages: next });
                      }}
                      isFirst={index === 0}
                      isLast={index === total - 1}
                    />
                  );
                }}
                onReorder={(from, to) => {}}
              />
            ) : (
              <DesktopList
                ids={cvData.languages.map((l) => l.id)}
                renderRow={(id) => {
                  const lang = cvData.languages.find((x) => x.id === id);
                  return (
                    <DesktopSortableRow
                      key={id}
                      id={id}
                      leading={<Languages className="h-4 w-4 text-muted-foreground" />}
                      label={lang ? `${lang.name || "Langue"} — ${lang.level || ""}` : "Langue"}
                    />
                  );
                }}
                onReorder={(activeId, overId) => {
                  const next = reorderArrayById(cvData.languages, activeId, overId);
                  onCvDataChange({ ...cvData, languages: next });
                }}
              />
            )
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}