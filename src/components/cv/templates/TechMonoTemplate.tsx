import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';

interface TechMonoTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  return `${year}-${month || '00'}`;
}

export function TechMonoTemplate({ data, sectionOrder }: TechMonoTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  const mainOrder = order.filter((s) => s === 'summary' || s === 'experience' || s === 'education');
  const sideOrder = order.filter((s) => s === 'skills' || s === 'languages');

  return (
    <div
      className="bg-zinc-950 text-zinc-100 min-h-full"
      style={{
        fontFamily: "'Courier New', 'Roboto Mono', monospace",
        fontSize: '10pt',
        lineHeight: '1.45',
      }}
    >
      <header className="p-6 border-b border-emerald-600/50 bg-zinc-900">
        <p className="text-emerald-400 text-[11px] mb-2">$ whoami</p>
        <h1 className="text-3xl font-bold text-emerald-300 tracking-tight">
          {personalInfo.firstName || 'prenom'}_{personalInfo.lastName || 'nom'}
        </h1>
        <p className="text-zinc-300 text-sm mt-1">&gt; {personalInfo.title || 'titre_professionnel'}</p>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-zinc-400">
          {personalInfo.email && <p>[email] {personalInfo.email}</p>}
          {personalInfo.phone && <p>[phone] {personalInfo.phone}</p>}
          {personalInfo.address && <p className="col-span-2">[location] {personalInfo.address}</p>}
          {personalInfo.linkedin && <p className="col-span-2 break-all">[linkedin] {personalInfo.linkedin}</p>}
          {personalInfo.website && <p className="col-span-2 break-all">[website] {personalInfo.website}</p>}
        </div>
      </header>

      <div className="p-5 grid grid-cols-12 gap-4">
        <main className="col-span-8 space-y-4">
          {(() => {
            const summaryBlock = personalInfo.summary ? (
              <section className="border border-emerald-700/50 bg-zinc-900/70 p-3">
                <h2 className="text-emerald-300 text-[11px] mb-2"># summary</h2>
                <p className="text-[11px] text-zinc-200 whitespace-pre-line">{personalInfo.summary}</p>
              </section>
            ) : null;

            const experienceBlock = experiences.length > 0 ? (
              <section className="border border-emerald-700/50 bg-zinc-900/70 p-3">
                <h2 className="text-emerald-300 text-[11px] mb-2"># experience.log</h2>
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <article key={exp.id} className="border border-zinc-700 bg-zinc-950/70 p-2.5">
                      <p className="text-[10px] text-emerald-400 mb-1">
                        [{formatDate(exp.startDate)} .. {exp.current ? 'present' : formatDate(exp.endDate)}]
                      </p>
                      <p className="text-[11px] text-zinc-100 font-bold">
                        {exp.position || 'poste'} @ {exp.company || 'entreprise'}
                      </p>
                      {exp.description && <p className="text-[11px] text-zinc-300 mt-1.5 whitespace-pre-line">{exp.description}</p>}
                    </article>
                  ))}
                </div>
              </section>
            ) : null;

            const educationBlock = education.length > 0 ? (
              <section className="border border-emerald-700/50 bg-zinc-900/70 p-3">
                <h2 className="text-emerald-300 text-[11px] mb-2"># education.db</h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <article key={edu.id} className="border-l-2 border-emerald-500/60 pl-2.5">
                      <p className="text-[11px] text-zinc-100 font-bold">
                        {edu.degree || 'diplome'}{edu.field && ` / ${edu.field}`}
                      </p>
                      <p className="text-[10px] text-zinc-300">{edu.school || 'etablissement'}</p>
                      <p className="text-[10px] text-zinc-500">{formatDate(edu.startDate)} .. {formatDate(edu.endDate)}</p>
                      {edu.description && <p className="text-[11px] text-zinc-300 mt-1">{edu.description}</p>}
                    </article>
                  ))}
                </div>
              </section>
            ) : null;

            const map: Record<CVSectionId, React.ReactNode> = {
              summary: summaryBlock,
              experience: experienceBlock,
              education: educationBlock,
              skills: null,
              languages: null,
            };

            return mainOrder.map((id) => map[id]).filter(Boolean);
          })()}
        </main>

        <aside className="col-span-4 space-y-4">
          {(() => {
            const skillsBlock = skills.length > 0 ? (
              <section className="border border-cyan-600/50 bg-zinc-900/70 p-3">
                <h2 className="text-cyan-300 text-[11px] mb-2"># stack[]</h2>
                <div className="space-y-1.5">
                  {skills.map((skill) => (
                    <p key={skill.id} className="text-[11px] text-zinc-200">- {skill.name || 'competence'}</p>
                  ))}
                </div>
              </section>
            ) : null;

            const languagesBlock = languages.length > 0 ? (
              <section className="border border-cyan-600/50 bg-zinc-900/70 p-3">
                <h2 className="text-cyan-300 text-[11px] mb-2"># locales{} </h2>
                <div className="space-y-1.5">
                  {languages.map((lang) => (
                    <p key={lang.id} className="text-[11px] text-zinc-200">
                      {lang.name || 'langue'}: <span className="text-zinc-400">{lang.level}</span>
                    </p>
                  ))}
                </div>
              </section>
            ) : null;

            const map: Record<CVSectionId, React.ReactNode> = {
              summary: null,
              experience: null,
              education: null,
              skills: skillsBlock,
              languages: languagesBlock,
            };

            return sideOrder.map((id) => map[id]).filter(Boolean);
          })()}

          {!hasContent && (
            <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-700">
              <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
