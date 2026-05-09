import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface NordicTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function NordicTemplate({ data, sectionOrder }: NordicTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, projects, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  const charcoal = '#1e293b';
  const glacier = '#bae6fd';
  const glacierDark = '#0284c7';

  return (
    <div
      className="min-h-full"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.6',
        background: '#fafbfc',
        color: charcoal,
        fontWeight: 300,
      }}
    >
      {/* Airy header */}
      <div className="px-10 pt-10 pb-7">
        <div className="flex items-center gap-6">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-20 h-20 rounded-full object-cover"
              style={{ border: `3px solid ${glacier}`, boxShadow: `0 4px 20px ${glacier}40` }}
            />
          )}
          <div>
            <h1 className="text-3xl mb-0.5" style={{ fontWeight: 200, letterSpacing: '-0.02em', color: charcoal }}>
              {personalInfo.firstName || 'Prénom'}{' '}
              <span style={{ fontWeight: 600 }}>{personalInfo.lastName || 'Nom'}</span>
            </h1>
            <p className="text-xs font-medium tracking-wide" style={{ color: glacierDark }}>{personalInfo.title || 'Titre professionnel'}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[10px]" style={{ color: '#64748b' }}>
          {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" style={{ color: glacierDark }} />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" style={{ color: glacierDark }} />{personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" style={{ color: glacierDark }} />{personalInfo.address}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3" style={{ color: glacierDark }} />{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" style={{ color: glacierDark }} />{personalInfo.website}</span>}
        </div>
      </div>

      <div className="h-px mx-10" style={{ background: `linear-gradient(90deg, ${glacier}, transparent)` }} />

      {/* Body — generous whitespace */}
      <div className="px-10 py-7 space-y-6">
        {(() => {
          const summarySection = personalInfo.summary ? (
            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: glacierDark }}>Profil</h2>
              <p className="text-[10px] leading-relaxed" style={{ color: '#475569' }}>{personalInfo.summary}</p>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: glacierDark }}>Expérience</h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-2xl" style={{ background: '#ffffff', border: `1px solid ${glacier}60` }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-sm" style={{ color: charcoal }}>{exp.position || 'Poste'}</h3>
                        <p className="text-[10px] font-medium" style={{ color: glacierDark }}>{exp.company || 'Entreprise'}</p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${glacier}40`, color: glacierDark }}>
                        {formatDate(exp.startDate)} – {exp.current ? 'Présent' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && <p className="text-[10px] leading-relaxed whitespace-pre-line mt-2" style={{ color: '#475569' }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: glacierDark }}>Formation</h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-2xl" style={{ background: '#ffffff', border: `1px solid ${glacier}60` }}>
                    <h3 className="font-semibold text-xs" style={{ color: charcoal }}>
                      {edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}
                    </h3>
                    <p className="text-[10px] font-medium" style={{ color: glacierDark }}>{edu.school || 'Établissement'}</p>
                    <p className="text-[9px]" style={{ color: '#94a3b8' }}>{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                    {edu.description && <p className="text-[10px] mt-1" style={{ color: '#475569' }}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const projectsSection = (projects || []).length > 0 ? (
            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: glacierDark }}>Projets</h2>
              <div className="grid grid-cols-2 gap-3">
                {(projects || []).map((p) => (
                  <div key={p.id} className="p-3 rounded-xl" style={{ background: '#fff', border: `1px solid ${glacier}60` }}>
                    <h3 className="font-semibold text-[10px]" style={{ color: charcoal }}>{p.name}</h3>
                    {p.description && <p className="text-[9px] mt-0.5" style={{ color: '#475569' }}>{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const skillsSection = skills.length > 0 ? (
            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: glacierDark }}>Compétences</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="px-3 py-1 rounded-full text-[10px] font-medium" style={{ background: `${glacier}50`, color: charcoal }}>
                    {skill.name || 'Compétence'}
                  </span>
                ))}
              </div>
            </section>
          ) : null;

          const languagesSection = languages.length > 0 ? (
            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: glacierDark }}>Langues</h2>
              <div className="flex gap-4">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-[10px]">
                    <span className="font-semibold" style={{ color: charcoal }}>{lang.name || 'Langue'}</span>
                    <span className="ml-1" style={{ color: '#94a3b8' }}>({lang.level})</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const certsSection = (certifications || []).length > 0 ? (
            <section>
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: glacierDark }}>Certifications</h2>
              <div className="space-y-1">
                {(certifications || []).map((cert) => (
                  <div key={cert.id} className="text-[10px]">
                    <span className="font-semibold" style={{ color: charcoal }}>{cert.name}</span>
                    <span style={{ color: '#94a3b8' }}> – {cert.issuer}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: summarySection, experience: experienceSection, education: educationSection,
            projects: projectsSection, skills: skillsSection, languages: languagesSection,
            certifications: certsSection,
          };
          return order.map((id) => map[id]).filter(Boolean);
        })()}

        {!hasContent && (
          <div className="text-center py-12" style={{ color: '#94a3b8' }}><p>Remplissez le formulaire</p></div>
        )}
      </div>
    </div>
  );
}
