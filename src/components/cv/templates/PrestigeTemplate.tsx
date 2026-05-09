import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface PrestigeTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function PrestigeTemplate({ data, sectionOrder }: PrestigeTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, projects, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );
  const sidebarOrder = order.filter((s) => s === 'skills' || s === 'languages' || s === 'certifications');
  const mainOrder = order.filter((s) => s === 'summary' || s === 'experience' || s === 'education' || s === 'projects');

  const gold = '#d4a843';
  const goldLight = '#e8c976';

  return (
    <div
      className="min-h-full flex"
      style={{
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5',
        background: '#09090b',
        color: '#e4e4e7',
      }}
    >
      {/* Sidebar */}
      <div
        className="p-7 flex flex-col"
        style={{
          width: '78mm',
          background: 'linear-gradient(180deg, #18181b 0%, #0a0a0b 100%)',
          borderRight: `1px solid ${gold}33`,
        }}
      >
        {/* Photo */}
        <div className="mb-6 text-center">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-28 h-28 rounded-full object-cover mx-auto"
              style={{ border: `3px solid ${gold}`, boxShadow: `0 0 30px ${gold}15` }}
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full mx-auto flex items-center justify-center text-3xl font-bold"
              style={{ border: `2px solid ${gold}`, color: gold, background: '#18181b' }}
            >
              {(personalInfo.firstName?.[0] || 'P')}{(personalInfo.lastName?.[0] || 'N')}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: '#fafafa' }}
          >
            {personalInfo.firstName || 'Prénom'}
          </h1>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: gold }}
          >
            {personalInfo.lastName || 'Nom'}
          </h1>
          <div className="h-px w-16 mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
          <p className="text-xs mt-2" style={{ color: '#a1a1aa' }}>
            {personalInfo.title || 'Titre professionnel'}
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-2.5 text-[10px] mb-6 pb-5" style={{ borderBottom: `1px solid ${gold}20` }}>
          {personalInfo.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: gold }} />
              <span className="text-zinc-300 break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: gold }} />
              <span className="text-zinc-300">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: gold }} />
              <span className="text-zinc-300">{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2.5">
              <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: gold }} />
              <span className="text-zinc-300 break-all">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2.5">
              <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: gold }} />
              <span className="text-zinc-300 break-all">{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Sidebar sections */}
        {(() => {
          const skillsBlock = skills.length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: gold }}>
                Compétences
              </h3>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-200">{skill.name || 'Compétence'}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: dot <= (skill.level || 3) ? gold : '#27272a',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;

          const languagesBlock = languages.length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: gold }}>
                Langues
              </h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-[10px]">
                    <span className="text-zinc-200">{lang.name || 'Langue'}</span>
                    <span style={{ color: goldLight }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null;

          const certsBlock = (certifications || []).length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3" style={{ color: gold }}>
                Certifications
              </h3>
              {(certifications || []).map((cert) => (
                <div key={cert.id} className="mb-2 text-[10px]">
                  <p className="text-zinc-200 font-semibold">{cert.name}</p>
                  <p className="text-zinc-500">{cert.issuer}</p>
                </div>
              ))}
            </div>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: null, experience: null, education: null, projects: null,
            skills: skillsBlock, languages: languagesBlock, certifications: certsBlock,
          };
          return sidebarOrder.map((id) => map[id]).filter(Boolean);
        })()}
      </div>

      {/* Main content */}
      <div className="flex-1 p-7 space-y-5">
        {(() => {
          const summarySection = personalInfo.summary ? (
            <section className="pb-4" style={{ borderBottom: `1px solid ${gold}20` }}>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-2" style={{ color: gold }}>
                Profil
              </h2>
              <p className="text-zinc-300 text-[10px] leading-relaxed">{personalInfo.summary}</p>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-3" style={{ color: gold }}>
                Expérience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="pl-4" style={{ borderLeft: `2px solid ${gold}40` }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-zinc-100 text-sm">{exp.position || 'Poste'}</h3>
                        <p className="text-xs font-semibold" style={{ color: goldLight }}>{exp.company || 'Entreprise'}</p>
                      </div>
                      <span className="text-[10px] text-zinc-500 whitespace-nowrap ml-3">
                        {formatDate(exp.startDate)} – {exp.current ? 'Présent' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-zinc-400 text-[10px] leading-relaxed whitespace-pre-line mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-3" style={{ color: gold }}>
                Formation
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="pl-4" style={{ borderLeft: `2px solid ${gold}40` }}>
                    <h3 className="font-bold text-zinc-100 text-sm">
                      {edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}
                    </h3>
                    <p className="text-xs" style={{ color: goldLight }}>{edu.school || 'Établissement'}</p>
                    <p className="text-[10px] text-zinc-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                    {edu.description && <p className="text-zinc-400 text-[10px] mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const projectsSection = (projects || []).length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-3" style={{ color: gold }}>
                Projets
              </h2>
              <div className="space-y-3">
                {(projects || []).map((p) => (
                  <div key={p.id} className="pl-4" style={{ borderLeft: `2px solid ${gold}40` }}>
                    <h3 className="font-bold text-zinc-100 text-xs">{p.name}</h3>
                    {p.description && <p className="text-zinc-400 text-[10px] mt-0.5">{p.description}</p>}
                    {p.url && <p className="text-[9px] mt-0.5" style={{ color: goldLight }}>{p.url}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: summarySection, experience: experienceSection, education: educationSection,
            projects: projectsSection, skills: null, languages: null, certifications: null,
          };
          return mainOrder.map((id) => map[id]).filter(Boolean);
        })()}

        {!hasContent && (
          <div className="text-center py-12 text-zinc-500">
            <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
