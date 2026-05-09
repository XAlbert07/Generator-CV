import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface TeacherTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function TeacherTemplate({ data, sectionOrder }: TeacherTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );
  const leftOrder = order.filter((s) => s === 'summary' || s === 'skills' || s === 'languages' || s === 'certifications');
  const rightOrder = order.filter((s) => s === 'experience' || s === 'education' || s === 'projects');

  const slate = '#475569';
  const amber = '#f59e0b';

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Open Sans', 'Inter', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.6',
      }}
    >
      {/* Header with warm accent */}
      <div className="px-7 pt-7 pb-5" style={{ borderBottom: `3px solid ${amber}` }}>
        <div className="flex items-center gap-5">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-24 h-24 rounded-lg object-cover shadow"
              style={{ border: `2px solid ${amber}` }}
            />
          ) : (
            <div className="w-24 h-24 rounded-lg flex items-center justify-center text-2xl font-bold text-white" style={{ background: slate }}>
              {(personalInfo.firstName?.[0] || 'P')}{(personalInfo.lastName?.[0] || 'N')}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-0.5" style={{ color: slate }}>
              {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
            </h1>
            <p className="text-sm font-semibold" style={{ color: amber }}>{personalInfo.title || 'Enseignant(e)'}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-600">
              {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: slate }} />{personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: slate }} />{personalInfo.phone}</span>}
              {personalInfo.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: slate }} />{personalInfo.address}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" style={{ color: slate }} />{personalInfo.linkedin}</span>}
              {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: slate }} />{personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex px-7 py-5 gap-5">
        {/* Left column — 40% */}
        <div className="space-y-4" style={{ width: '40%' }}>
          {(() => {
            const summaryBlock = personalInfo.summary ? (
              <section>
                <h2 className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: slate }}>
                  <span className="inline-block pb-1" style={{ borderBottom: `2px solid ${amber}` }}>À propos</span>
                </h2>
                <p className="text-[10px] text-gray-700 leading-relaxed">{personalInfo.summary}</p>
              </section>
            ) : null;

            const skillsBlock = skills.length > 0 ? (
              <section>
                <h2 className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: slate }}>
                  <span className="inline-block pb-1" style={{ borderBottom: `2px solid ${amber}` }}>Matières & Compétences</span>
                </h2>
                <div className="space-y-1.5">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="px-2.5 py-1.5 rounded text-[10px] font-medium"
                      style={{ background: `${amber}15`, color: '#92400e', borderLeft: `3px solid ${amber}` }}
                    >
                      {skill.name || 'Matière'}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

            const languagesBlock = languages.length > 0 ? (
              <section>
                <h2 className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: slate }}>
                  <span className="inline-block pb-1" style={{ borderBottom: `2px solid ${amber}` }}>Langues</span>
                </h2>
                <div className="space-y-1.5">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between text-[10px]">
                      <span className="font-medium text-gray-700">{lang.name || 'Langue'}</span>
                      <span className="text-gray-500">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

            const certsBlock = (certifications || []).length > 0 ? (
              <section>
                <h2 className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: slate }}>
                  <span className="inline-block pb-1" style={{ borderBottom: `2px solid ${amber}` }}>Certifications</span>
                </h2>
                <div className="space-y-1.5">
                  {(certifications || []).map((cert) => (
                    <div key={cert.id} className="text-[10px]">
                      <p className="font-semibold text-gray-800">{cert.name}</p>
                      <p className="text-gray-500">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

            const map: Record<CVSectionId, React.ReactNode> = {
              summary: summaryBlock, experience: null, education: null, projects: null,
              skills: skillsBlock, languages: languagesBlock, certifications: certsBlock,
            };
            return leftOrder.map((id) => map[id]).filter(Boolean);
          })()}
        </div>

        {/* Right column — 60% */}
        <div className="flex-1 space-y-4">
          {(() => {
            const experienceBlock = experiences.length > 0 ? (
              <section>
                <h2 className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: slate }}>
                  <span className="inline-block pb-1" style={{ borderBottom: `2px solid ${amber}` }}>Expérience pédagogique</span>
                </h2>
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="pl-3" style={{ borderLeft: `2px solid ${amber}40` }}>
                      <div className="flex justify-between items-start mb-0.5">
                        <div>
                          <h3 className="font-bold text-gray-900 text-xs">{exp.position || 'Poste'}</h3>
                          <p className="text-[10px] font-medium" style={{ color: amber }}>{exp.company || 'Établissement'}</p>
                        </div>
                        <span className="text-[9px] text-gray-500 whitespace-nowrap ml-2">
                          {formatDate(exp.startDate)} – {exp.current ? 'Présent' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description && <p className="text-gray-700 text-[10px] leading-relaxed whitespace-pre-line mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

            const educationBlock = education.length > 0 ? (
              <section>
                <h2 className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: slate }}>
                  <span className="inline-block pb-1" style={{ borderBottom: `2px solid ${amber}` }}>Formation</span>
                </h2>
                <div className="space-y-2.5">
                  {education.map((edu) => (
                    <div key={edu.id} className="pl-3" style={{ borderLeft: `2px solid ${amber}40` }}>
                      <h3 className="font-bold text-gray-900 text-xs">{edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}</h3>
                      <p className="text-[10px] font-medium" style={{ color: amber }}>{edu.school || 'Établissement'}</p>
                      <p className="text-[9px] text-gray-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                      {edu.description && <p className="text-gray-600 text-[10px] mt-0.5">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ) : null;

            const map: Record<CVSectionId, React.ReactNode> = {
              summary: null, experience: experienceBlock, education: educationBlock,
              projects: null, skills: null, languages: null, certifications: null,
            };
            return rightOrder.map((id) => map[id]).filter(Boolean);
          })()}
        </div>
      </div>

      {!hasContent && (
        <div className="text-center py-12 text-gray-400 px-7"><p>Remplissez le formulaire</p></div>
      )}
    </div>
  );
}
