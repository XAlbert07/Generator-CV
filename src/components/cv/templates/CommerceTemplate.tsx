import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface CommerceTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function CommerceTemplate({ data, sectionOrder }: CommerceTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  const orange = '#ea580c';
  const charcoal = '#1c1917';

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Poppins', 'Inter', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5',
      }}
    >
      {/* Dynamic header with diagonal accent */}
      <div className="relative overflow-hidden">
        <div
          className="px-7 pt-7 pb-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${charcoal} 0%, #292524 70%, ${orange} 100%)`,
          }}
        >
          <div className="flex items-center gap-5">
            {personalInfo.photo && (
              <img
                src={personalInfo.photo}
                alt="Photo"
                className="w-24 h-24 rounded-xl object-cover shadow-lg"
                style={{ border: `3px solid ${orange}` }}
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-0.5">
                {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
              </h1>
              <p className="text-sm font-medium" style={{ color: '#fdba74' }}>
                {personalInfo.title || 'Commercial(e)'}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-300">
                {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: orange }} />{personalInfo.email}</span>}
                {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: orange }} />{personalInfo.phone}</span>}
                {personalInfo.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: orange }} />{personalInfo.address}</span>}
                {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" style={{ color: orange }} />{personalInfo.linkedin}</span>}
                {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: orange }} />{personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-7 py-5 space-y-5">
        {(() => {
          const summarySection = personalInfo.summary ? (
            <section className="p-4 rounded-lg" style={{ background: `${orange}08`, borderLeft: `4px solid ${orange}` }}>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: orange }}>Profil</h2>
              <p className="text-gray-700 text-[10px] leading-relaxed">{personalInfo.summary}</p>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: orange, borderBottom: `2px solid ${orange}20` }}>
                Expérience commerciale
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-lg" style={{ background: '#fafaf9', border: '1px solid #e7e5e4' }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Poste'}</h3>
                        <p className="text-xs font-semibold" style={{ color: orange }}>{exp.company || 'Entreprise'}</p>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${orange}15`, color: orange }}>
                        {formatDate(exp.startDate)} – {exp.current ? 'Présent' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-[10px] leading-relaxed whitespace-pre-line mt-1.5">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ color: orange, borderBottom: `2px solid ${orange}20` }}>
                Formation
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="flex gap-3">
                    <div className="shrink-0 w-[72px] text-[9px] text-gray-500 pt-0.5">
                      {formatDate(edu.startDate)}<br />{formatDate(edu.endDate)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xs">{edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}</h3>
                      <p className="text-[10px]" style={{ color: orange }}>{edu.school || 'Établissement'}</p>
                      {edu.description && <p className="text-gray-600 text-[10px] mt-0.5">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const skillsSection = skills.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ color: orange, borderBottom: `2px solid ${orange}20` }}>
                Compétences
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-white" style={{ background: orange }}>
                    {skill.name || 'Compétence'}
                  </span>
                ))}
              </div>
            </section>
          ) : null;

          const languagesSection = languages.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ color: orange, borderBottom: `2px solid ${orange}20` }}>
                Langues
              </h2>
              <div className="flex gap-4 flex-wrap">
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
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ color: orange, borderBottom: `2px solid ${orange}20` }}>
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
            summary: summarySection, experience: experienceSection, education: educationSection,
            projects: null, skills: skillsSection, languages: languagesSection, certifications: certsSection,
          };
          return order.map((id) => map[id]).filter(Boolean);
        })()}

        {!hasContent && (
          <div className="text-center py-12 text-gray-400"><p>Remplissez le formulaire</p></div>
        )}
      </div>
    </div>
  );
}
