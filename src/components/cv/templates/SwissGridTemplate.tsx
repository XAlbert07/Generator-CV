import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface SwissGridTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export function SwissGridTemplate({ data, sectionOrder }: SwissGridTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  const sideOrder = order.filter((s) => s === 'summary' || s === 'skills' || s === 'languages');
  const mainOrder = order.filter((s) => s === 'experience' || s === 'education');

  return (
    <div
      className="bg-[#f7f7f4] text-zinc-900 min-h-full"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5',
      }}
    >
      <header className="px-7 py-6 border-b-4 border-red-700">
        <div className="grid grid-cols-12 gap-4 items-start">
          <div className="col-span-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 mb-2">Curriculum Vitae</p>
            <h1 className="text-4xl font-extrabold tracking-tight uppercase leading-none">
              {personalInfo.firstName || 'Prenom'} {personalInfo.lastName || 'Nom'}
            </h1>
            <p className="mt-2 text-sm font-semibold text-red-700">{personalInfo.title || 'Titre professionnel'}</p>
          </div>
          {personalInfo.photo && (
            <div className="col-span-4 flex justify-end">
              <img
                src={personalInfo.photo}
                alt="Photo"
                className="w-24 h-24 object-cover border-2 border-zinc-900"
              />
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-zinc-700">
          {personalInfo.email && (
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span className="truncate">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span className="truncate">{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2 min-w-0">
              <Linkedin className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span className="truncate">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 min-w-0 col-span-2">
              <Globe className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span className="truncate">{personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>

      <div className="p-6 grid grid-cols-12 gap-5">
        <aside className="col-span-4 space-y-4">
          {(() => {
            const summaryBlock = personalInfo.summary ? (
              <section className="border-2 border-zinc-900 bg-white p-3">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 mb-2">Profil</h2>
                <p className="text-[11px] text-zinc-700 leading-relaxed">{personalInfo.summary}</p>
              </section>
            ) : null;

            const skillsBlock = skills.length > 0 ? (
              <section className="border-2 border-zinc-900 bg-white p-3">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 mb-2">Competences</h2>
                <div className="space-y-1.5">
                  {skills.map((skill) => (
                    <div key={skill.id} className="text-[11px] border-l-2 border-red-700 pl-2">
                      {skill.name || 'Competence'}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

            const languagesBlock = languages.length > 0 ? (
              <section className="border-2 border-zinc-900 bg-white p-3">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 mb-2">Langues</h2>
                <div className="space-y-1.5">
                  {languages.map((lang) => (
                    <div key={lang.id} className="text-[11px] flex justify-between gap-2">
                      <span className="font-medium">{lang.name || 'Langue'}</span>
                      <span className="text-zinc-600">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

            const map: Record<CVSectionId, React.ReactNode> = {
              summary: summaryBlock,
              experience: null,
              education: null,
              skills: skillsBlock,
              languages: languagesBlock,
            };

            return sideOrder.map((id) => map[id]).filter(Boolean);
          })()}
        </aside>

        <main className="col-span-8 space-y-5">
          {(() => {
            const experienceBlock = experiences.length > 0 ? (
              <section className="border border-zinc-300 bg-white p-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-700 pb-2 border-b border-zinc-300">
                  Experience
                </h2>
                <div className="mt-3 space-y-3">
                  {experiences.map((exp) => (
                    <article key={exp.id} className="pt-2 border-t border-zinc-200 first:border-t-0 first:pt-0">
                      <div className="grid grid-cols-[92px_1fr] gap-3">
                        <p className="text-[10px] text-zinc-500 font-medium">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </p>
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-900">{exp.position || 'Poste'}</h3>
                          <p className="text-[11px] font-medium text-red-700">{exp.company || 'Entreprise'}</p>
                          {exp.description && (
                            <p className="text-[11px] text-zinc-700 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null;

            const educationBlock = education.length > 0 ? (
              <section className="border border-zinc-300 bg-white p-4">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-700 pb-2 border-b border-zinc-300">
                  Formation
                </h2>
                <div className="mt-3 space-y-3">
                  {education.map((edu) => (
                    <article key={edu.id} className="pt-2 border-t border-zinc-200 first:border-t-0 first:pt-0">
                      <div className="grid grid-cols-[92px_1fr] gap-3">
                        <p className="text-[10px] text-zinc-500 font-medium">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                        <div>
                          <h3 className="text-sm font-semibold text-zinc-900">
                            {edu.degree || 'Diplome'}{edu.field && ` - ${edu.field}`}
                          </h3>
                          <p className="text-[11px] font-medium text-red-700">{edu.school || 'Etablissement'}</p>
                          {edu.description && <p className="text-[11px] text-zinc-700 mt-1.5 leading-relaxed">{edu.description}</p>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null;

            const map: Record<CVSectionId, React.ReactNode> = {
              summary: null,
              experience: experienceBlock,
              education: educationBlock,
              skills: null,
              languages: null,
            };

            return mainOrder.map((id) => map[id]).filter(Boolean);
          })()}

          {!hasContent && (
            <div className="text-center py-12 text-zinc-400 border border-dashed border-zinc-300 bg-white">
              <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
