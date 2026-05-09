import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface FreelanceTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function FreelanceTemplate({ data, sectionOrder }: FreelanceTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, projects, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );
  const sidebarOrder = order.filter((s) => s === 'summary' || s === 'skills' || s === 'languages' || s === 'certifications');
  const mainOrder = order.filter((s) => s === 'experience' || s === 'education' || s === 'projects');

  const purple = '#7c3aed';
  const pink = '#ec4899';

  return (
    <div
      className="bg-white text-gray-900 min-h-full flex"
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5',
      }}
    >
      {/* Large sidebar — pitch + services */}
      <div
        className="text-white p-7 flex flex-col"
        style={{
          width: '85mm',
          background: `linear-gradient(160deg, ${purple} 0%, #5b21b6 60%, #3b0764 100%)`,
        }}
      >
        {/* Photo */}
        <div className="text-center mb-5">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-28 h-28 rounded-full object-cover mx-auto shadow-2xl"
              style={{ border: `4px solid ${pink}60` }}
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full mx-auto flex items-center justify-center text-3xl font-bold"
              style={{ background: `linear-gradient(135deg, ${purple}, ${pink})` }}
            >
              {(personalInfo.firstName?.[0] || 'P')}{(personalInfo.lastName?.[0] || 'N')}
            </div>
          )}
        </div>

        {/* Name */}
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold">
            {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
          </h1>
          <div className="h-0.5 w-16 mx-auto my-2" style={{ background: `linear-gradient(90deg, ${pink}, transparent)` }} />
          <p className="text-purple-200 text-xs">{personalInfo.title || 'Freelance'}</p>
        </div>

        {/* Contact */}
        <div className="space-y-2 text-[10px] mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0" style={{ color: pink }} /><span className="break-all">{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" style={{ color: pink }} /><span>{personalInfo.phone}</span></div>}
          {personalInfo.address && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: pink }} /><span>{personalInfo.address}</span></div>}
          {personalInfo.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: pink }} /><span className="break-all">{personalInfo.linkedin}</span></div>}
          {personalInfo.website && <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 shrink-0" style={{ color: pink }} /><span className="break-all">{personalInfo.website}</span></div>}
        </div>

        {/* Sidebar sections */}
        {(() => {
          const summaryBlock = personalInfo.summary ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: pink }}>À propos</h3>
              <p className="text-purple-100 text-[10px] leading-relaxed">{personalInfo.summary}</p>
            </div>
          ) : null;

          const skillsBlock = skills.length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: pink }}>Compétences</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                    style={{ background: `${pink}25`, border: `1px solid ${pink}40` }}
                  >
                    {skill.name || 'Compétence'}
                  </span>
                ))}
              </div>
            </div>
          ) : null;

          const languagesBlock = languages.length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: pink }}>Langues</h3>
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-[10px] mb-1">
                  <span>{lang.name || 'Langue'}</span>
                  <span className="text-purple-200">{lang.level}</span>
                </div>
              ))}
            </div>
          ) : null;

          const certsBlock = (certifications || []).length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: pink }}>Certifications</h3>
              {(certifications || []).map((cert) => (
                <div key={cert.id} className="mb-1.5 text-[10px]">
                  <p className="font-semibold">{cert.name}</p>
                  <p className="text-purple-200">{cert.issuer}</p>
                </div>
              ))}
            </div>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: summaryBlock, experience: null, education: null, projects: null,
            skills: skillsBlock, languages: languagesBlock, certifications: certsBlock,
          };
          return sidebarOrder.map((id) => map[id]).filter(Boolean);
        })()}
      </div>

      {/* Main */}
      <div className="flex-1 p-7 space-y-5">
        {(() => {
          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: purple }}>Missions</h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-lg" style={{ background: `${purple}05`, borderLeft: `3px solid ${purple}` }}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Mission'}</h3>
                        <p className="text-xs" style={{ color: purple }}>{exp.company || 'Client'}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap ml-3">
                        {formatDate(exp.startDate)} – {exp.current ? 'En cours' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-700 text-[10px] leading-relaxed whitespace-pre-line mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const projectsSection = (projects || []).length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: purple }}>Projets</h2>
              <div className="space-y-3">
                {(projects || []).map((p) => (
                  <div key={p.id} className="p-3 rounded-lg" style={{ background: `${pink}05`, borderLeft: `3px solid ${pink}` }}>
                    <h3 className="font-bold text-gray-900 text-xs">{p.name}</h3>
                    {p.description && <p className="text-gray-700 text-[10px] mt-0.5">{p.description}</p>}
                    {p.url && <p className="text-[9px] mt-0.5" style={{ color: purple }}>{p.url}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: purple }}>Formation</h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-900 text-xs">{edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}</h3>
                    <p className="text-[10px]" style={{ color: purple }}>{edu.school || 'Établissement'}</p>
                    <p className="text-[10px] text-gray-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: null, experience: experienceSection, education: educationSection,
            projects: projectsSection, skills: null, languages: null, certifications: null,
          };
          return mainOrder.map((id) => map[id]).filter(Boolean);
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
