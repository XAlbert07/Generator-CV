import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface EditorialTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Janv.', 'Fevr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Aout', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export function EditorialTemplate({ data, sectionOrder }: EditorialTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  const mainOrder = order.filter((s) => s === 'summary' || s === 'experience');
  const sideOrder = order.filter((s) => s === 'education' || s === 'skills' || s === 'languages');

  const summaryText = personalInfo.summary || '';
  const dropCap = summaryText ? summaryText.charAt(0) : '';
  const summaryRest = summaryText ? summaryText.slice(1) : '';

  return (
    <div
      className="bg-[#fffdf6] text-stone-800 min-h-full"
      style={{
        fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '10pt',
        lineHeight: '1.55',
      }}
    >
      <header className="px-8 pt-8 pb-6 border-b border-stone-400">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-2">Curriculum Vitae</p>
            <h1 className="text-5xl leading-none text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {personalInfo.firstName || 'Prenom'} {personalInfo.lastName || 'Nom'}
            </h1>
            <p className="mt-2 text-base italic text-stone-700" style={{ fontFamily: "'Playfair Display', serif" }}>
              {personalInfo.title || 'Titre professionnel'}
            </p>
          </div>
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-24 h-24 rounded-full object-cover border-2 border-stone-400"
            />
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-stone-700">
          {personalInfo.email && (
            <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>
          )}
          {personalInfo.address && (
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{personalInfo.address}</span>
          )}
          {personalInfo.linkedin && (
            <span className="inline-flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" />{personalInfo.linkedin}</span>
          )}
          {personalInfo.website && (
            <span className="inline-flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{personalInfo.website}</span>
          )}
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-8">
          <main className="col-span-8 space-y-6">
            {(() => {
              const summaryBlock = personalInfo.summary ? (
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.24em] text-stone-500 border-b border-stone-300 pb-2 mb-3">
                    Profil
                  </h2>
                  <p className="text-[12px] text-stone-700 leading-relaxed">
                    <span
                      className="float-left mr-2 text-5xl leading-[0.9] text-stone-900"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {dropCap}
                    </span>
                    {summaryRest}
                  </p>
                </section>
              ) : null;

              const experienceBlock = experiences.length > 0 ? (
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.24em] text-stone-500 border-b border-stone-300 pb-2 mb-3">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <article key={exp.id} className="pb-3 border-b border-stone-200 last:border-b-0">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h3 className="text-base text-stone-900 font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {exp.position || 'Poste'}
                            </h3>
                            <p className="text-[11px] uppercase tracking-wide text-stone-500">{exp.company || 'Entreprise'}</p>
                          </div>
                          <p className="text-[10px] text-stone-500 whitespace-nowrap mt-1">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </p>
                        </div>
                        {exp.description && (
                          <p className="text-[11px] text-stone-700 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null;

              const map: Record<CVSectionId, React.ReactNode> = {
                summary: summaryBlock,
                experience: experienceBlock,
                education: null,
                skills: null,
                languages: null,
              };

              return mainOrder.map((id) => map[id]).filter(Boolean);
            })()}
          </main>

          <aside className="col-span-4 border-l border-stone-300 pl-6 space-y-5">
            {(() => {
              const educationBlock = education.length > 0 ? (
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.24em] text-stone-500 border-b border-stone-300 pb-2 mb-3">
                    Formation
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <article key={edu.id} className="rounded border border-stone-300 bg-[#fffaf0] p-2.5">
                        <h3 className="text-sm font-semibold text-stone-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {edu.degree || 'Diplome'}{edu.field && ` - ${edu.field}`}
                        </h3>
                        <p className="text-[11px] text-stone-700">{edu.school || 'Etablissement'}</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                        {edu.description && <p className="text-[11px] text-stone-700 mt-1">{edu.description}</p>}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null;

              const skillsBlock = skills.length > 0 ? (
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.24em] text-stone-500 border-b border-stone-300 pb-2 mb-3">
                    Competences
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span key={skill.id} className="text-[11px] px-2 py-1 border border-stone-300 bg-white rounded-sm">
                        {skill.name || 'Competence'}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null;

              const languagesBlock = languages.length > 0 ? (
                <section>
                  <h2 className="text-[11px] uppercase tracking-[0.24em] text-stone-500 border-b border-stone-300 pb-2 mb-3">
                    Langues
                  </h2>
                  <div className="space-y-1.5">
                    {languages.map((lang) => (
                      <div key={lang.id} className="text-[11px] flex justify-between gap-2">
                        <span className="font-medium text-stone-800">{lang.name || 'Langue'}</span>
                        <span className="text-stone-500">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null;

              const map: Record<CVSectionId, React.ReactNode> = {
                summary: null,
                experience: null,
                education: educationBlock,
                skills: skillsBlock,
                languages: languagesBlock,
              };

              return sideOrder.map((id) => map[id]).filter(Boolean);
            })()}

            {!hasContent && (
              <div className="text-center py-8 text-stone-400 border border-dashed border-stone-300">
                <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
