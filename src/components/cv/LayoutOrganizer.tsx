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
import { GripVertical, RotateCcw, Layers, Briefcase, GraduationCap, Sparkles, Languages } from "lucide-react";

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

function SortableRow({
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
        "flex items-center gap-3 rounded-lg border bg-card px-3 py-2 shadow-sm",
        isDragging && "opacity-80 ring-2 ring-primary/20",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          type="button"
          className="p-1 -ml-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          aria-label="Déplacer"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {leading}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{label}</div>
        </div>
      </div>
    </div>
  );
}

function OrganizerList({
  ids,
  renderRow,
  onReorder,
}: {
  ids: string[];
  renderRow: (id: string) => React.ReactNode;
  onReorder: (activeId: string, overId: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
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

  return (
    <div className={cn("form-section space-y-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="cv-section-title">Organisation & priorité</h3>
          <p className="text-sm text-muted-foreground">
            Réorganise les sections et les listes par glisser-déposer. Idéal pour adapter le CV à un poste visé.
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
          Réinitialiser
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="targetRole">Poste visé (optionnel)</Label>
          <Input
            id="targetRole"
            value={targetRole ?? ""}
            onChange={(e) => onTargetRoleChange(e.target.value)}
            placeholder="Ex: Développeur Full‑Stack, Data Analyst…"
          />
        </div>
      </div>

      <Tabs defaultValue="sections" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="sections" className="whitespace-nowrap">
              Sections
            </TabsTrigger>
            <TabsTrigger value="experience" className="whitespace-nowrap">
              Expériences
            </TabsTrigger>
            <TabsTrigger value="education" className="whitespace-nowrap">
              Formation
            </TabsTrigger>
            <TabsTrigger value="skills" className="whitespace-nowrap">
              Compétences
            </TabsTrigger>
            <TabsTrigger value="languages" className="whitespace-nowrap">
              Langues
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="sections" className="mt-4">
          <OrganizerList
            ids={sectionIds}
            renderRow={(id) => {
              const sectionId = id as CVSectionId;
              const meta = SECTION_META[sectionId];
              return (
                <SortableRow
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
        </TabsContent>

        <TabsContent value="experience" className="mt-4">
          {cvData.experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoute au moins une expérience pour pouvoir la réorganiser.</p>
          ) : (
            <OrganizerList
              ids={cvData.experiences.map((e) => e.id)}
              renderRow={(id) => {
                const exp = cvData.experiences.find((x) => x.id === id);
                return (
                  <SortableRow
                    key={id}
                    id={id}
                    leading={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                    label={
                      exp
                        ? `${exp.position || "Poste"} — ${exp.company || "Entreprise"}`
                        : "Expérience"
                    }
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

        <TabsContent value="education" className="mt-4">
          {cvData.education.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoute au moins une formation pour pouvoir la réorganiser.</p>
          ) : (
            <OrganizerList
              ids={cvData.education.map((e) => e.id)}
              renderRow={(id) => {
                const edu = cvData.education.find((x) => x.id === id);
                return (
                  <SortableRow
                    key={id}
                    id={id}
                    leading={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
                    label={
                      edu
                        ? `${edu.degree || "Diplôme"} — ${edu.school || "Établissement"}`
                        : "Formation"
                    }
                  />
                );
              }}
              onReorder={(activeId, overId) => {
                const next = reorderArrayById(cvData.education, activeId, overId);
                onCvDataChange({ ...cvData, education: next });
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          {cvData.skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoute au moins une compétence pour pouvoir la réorganiser.</p>
          ) : (
            <OrganizerList
              ids={cvData.skills.map((s) => s.id)}
              renderRow={(id) => {
                const skill = cvData.skills.find((x) => x.id === id);
                return (
                  <SortableRow
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
          )}
        </TabsContent>

        <TabsContent value="languages" className="mt-4">
          {cvData.languages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoute au moins une langue pour pouvoir la réorganiser.</p>
          ) : (
            <OrganizerList
              ids={cvData.languages.map((l) => l.id)}
              renderRow={(id) => {
                const lang = cvData.languages.find((x) => x.id === id);
                return (
                  <SortableRow
                    key={id}
                    id={id}
                    leading={<Languages className="h-4 w-4 text-muted-foreground" />}
                    label={lang ? `${lang.name || "Langue"} — ${lang.level || ""}` : "Langue"}
                    className="items-center"
                  />
                );
              }}
              onReorder={(activeId, overId) => {
                const next = reorderArrayById(cvData.languages, activeId, overId);
                onCvDataChange({ ...cvData, languages: next });
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

