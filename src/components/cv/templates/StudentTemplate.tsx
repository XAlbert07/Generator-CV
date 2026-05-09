import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface StudentTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function StudentTemplate({ data, sectionOrder }: StudentTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, projects, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || education.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  const cyan = '#0891b2';

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5',
      }}
    >
      {/* Compact header */}
      <div className="px-7 pt-7 pb-5" style={{ borderBottom: `3px solid ${cyan}` }}>
        <div className="flex items-center gap-5">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-20 h-20 rounded-xl object-cover shadow-sm"
              style={{ border: `2px solid ${cyan}` }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
              {personalInfo.firstName || 'Prénom'}{' '}
              <span style={{ color: cyan }}>{personalInfo.lastName || 'Nom'}</span>
            </h1>
            <p className="text-sm text-gray-600 mb-2">{personalInfo.title || 'Étudiant(e)'}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-600">
              {personalInfo.email && (
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: cyan }} />{personalInfo.email}</span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: cyan }} />{personalInfo.phone}</span>
              )}
              {personalInfo.address && (
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: cyan }} />{personalInfo.address}</span>
              )}
              {personalInfo.linkedin && (
                <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" style={{ color: cyan }} />{personalInfo.linkedin}</span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: cyan }} />{personalInfo.website}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body — single column optimized for one page */}
      <div className="px-7 py-5 space-y-4">
        {(() => {
          const summarySection = personalInfo.summary ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: cyan }}>
                Profil
              </h2>
              <p className="text-[10px] text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: cyan }}>
                Formation
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="flex gap-3">
                    <div className="shrink-0 w-20 text-[9px] text-gray-500 pt-0.5">
                      {formatDate(edu.startDate)}<br />{formatDate(edu.endDate)}
                    </div>
                    <div className="flex-1 pl-3" style={{ borderLeft: `2px solid ${cyan}40` }}>
                      <h3 className="font-bold text-gray-900 text-xs">
                        {edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}
                      </h3>
                      <p className="text-[10px] font-medium" style={{ color: cyan }}>{edu.school || 'Établissement'}</p>
                      {edu.description && <p className="text-[10px] text-gray-600 mt-0.5">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: cyan }}>
                Expérience
              </h2>
              <div className="space-y-2.5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-3">
                    <div className="shrink-0 w-20 text-[9px] text-gray-500 pt-0.5">
                      {formatDate(exp.startDate)}<br />{exp.current ? 'Présent' : formatDate(exp.endDate)}
                    </div>
                    <div className="flex-1 pl-3" style={{ borderLeft: `2px solid ${cyan}40` }}>
                      <h3 className="font-bold text-gray-900 text-xs">{exp.position || 'Poste'}</h3>
                      <p className="text-[10px] font-medium" style={{ color: cyan }}>{exp.company || 'Entreprise'}</p>
                      {exp.description && <p className="text-[10px] text-gray-600 mt-0.5 whitespace-pre-line">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const projectsSection = (projects || []).length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: cyan }}>
                Projets
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {(projects || []).map((p) => (
                  <div key={p.id} className="p-2 rounded-lg" style={{ background: `${cyan}08`, border: `1px solid ${cyan}20` }}>
                    <h3 className="font-bold text-gray-900 text-[10px]">{p.name}</h3>
                    {p.description && <p className="text-gray-600 text-[9px] mt-0.5">{p.description}</p>}
                    {p.url && <p className="text-[8px] mt-0.5 truncate" style={{ color: cyan }}>{p.url}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const skillsSection = skills.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: cyan }}>
                Compétences
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                    style={{ background: `${cyan}12`, color: '#164e63', border: `1px solid ${cyan}25` }}
                  >
                    {skill.name || 'Compétence'}
                  </span>
                ))}
              </div>
            </section>
          ) : null;

          const languagesSection = languages.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: cyan }}>
                Langues
              </h2>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-[10px]">
                    <span className="font-semibold text-gray-900">{lang.name || 'Langue'}</span>
                    <span className="text-gray-500 ml-1">({lang.level})</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const certsSection = (certifications || []).length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: cyan }}>
                Certifications
              </h2>
              <div className="space-y-1">
                {(certifications || []).map((cert) => (
                  <div key={cert.id} className="text-[10px]">
                    <span className="font-semibold text-gray-900">{cert.name}</span>
                    <span className="text-gray-500"> – {cert.issuer}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: summarySection,
            education: educationSection,
            experience: experienceSection,
            projects: projectsSection,
            skills: skillsSection,
            languages: languagesSection,
            certifications: certsSection,
          };
          return order.map((id) => map[id]).filter(Boolean);
        })()}

        {!hasContent && (
          <div className="text-center py-12 text-gray-400">
            <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
