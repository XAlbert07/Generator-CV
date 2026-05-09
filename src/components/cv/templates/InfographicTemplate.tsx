import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface InfographicTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function SkillBar({ name, level }: { name: string; level: number }) {
  const pct = Math.min((level / 5) * 100, 100);
  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-[10px] mb-1">
        <span className="font-semibold text-white">{name}</span>
        <span className="text-indigo-200">{pct}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #06b6d4 0%, #818cf8 100%)',
          }}
        />
      </div>
    </div>
  );
}

export function InfographicTemplate({ data, sectionOrder }: InfographicTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, projects, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );
  const sidebarOrder = order.filter((s) => s === 'skills' || s === 'languages' || s === 'certifications');
  const mainOrder = order.filter((s) => s === 'summary' || s === 'experience' || s === 'education' || s === 'projects');

  return (
    <div
      className="bg-white text-gray-900 min-h-full flex"
      style={{
        fontFamily: "'Poppins', 'Inter', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5',
      }}
    >
      {/* Left sidebar — Dark with data viz */}
      <div
        className="text-white p-7 flex flex-col"
        style={{
          width: '78mm',
          background: 'linear-gradient(180deg, #312e81 0%, #1e1b4b 50%, #0f0a2e 100%)',
        }}
      >
        {/* Photo & Name */}
        <div className="text-center mb-6">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-28 h-28 rounded-2xl object-cover mx-auto mb-3 shadow-xl"
              style={{ border: '3px solid rgba(6,182,212,0.5)' }}
            />
          ) : (
            <div
              className="w-28 h-28 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl font-bold"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)' }}
            >
              {(personalInfo.firstName?.[0] || 'P')}{(personalInfo.lastName?.[0] || 'N')}
            </div>
          )}
          <h1 className="text-xl font-bold" style={{ color: '#a5b4fc' }}>
            {personalInfo.firstName || 'Prénom'}
          </h1>
          <h1 className="text-xl font-bold text-white">
            {personalInfo.lastName || 'Nom'}
          </h1>
          <div className="h-0.5 w-12 mx-auto my-2 rounded-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #818cf8)' }} />
          <p className="text-indigo-200 text-xs">{personalInfo.title || 'Titre professionnel'}</p>
        </div>

        {/* Contact */}
        <div className="space-y-2 text-[10px] mb-6 pb-5 border-b border-indigo-700/50">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: '#06b6d4' }} />
              <span className="text-indigo-100 break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: '#06b6d4' }} />
              <span className="text-indigo-100">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#06b6d4' }} />
              <span className="text-indigo-100">{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 shrink-0" style={{ color: '#06b6d4' }} />
              <span className="text-indigo-100 break-all">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: '#06b6d4' }} />
              <span className="text-indigo-100 break-all">{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Sidebar sections with visual bars */}
        {(() => {
          const skillsBlock = skills.length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: '#06b6d4' }}>
                Compétences
              </h3>
              {skills.map((skill) => (
                <SkillBar key={skill.id} name={skill.name || 'Compétence'} level={skill.level || 3} />
              ))}
            </div>
          ) : null;

          const languagesBlock = languages.length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: '#06b6d4' }}>
                Langues
              </h3>
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-[10px] mb-1.5">
                  <span className="text-white font-medium">{lang.name || 'Langue'}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-semibold"
                    style={{ background: 'rgba(6,182,212,0.2)', color: '#67e8f9' }}
                  >
                    {lang.level}
                  </span>
                </div>
              ))}
            </div>
          ) : null;

          const certsBlock = (certifications || []).length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3" style={{ color: '#06b6d4' }}>
                Certifications
              </h3>
              {(certifications || []).map((cert) => (
                <div key={cert.id} className="mb-2 text-[10px]">
                  <p className="text-white font-semibold">{cert.name}</p>
                  <p className="text-indigo-300">{cert.issuer}</p>
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
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#4f46e5' }}>
                Profil
              </h2>
              <p className="text-gray-700 text-[10px] leading-relaxed">{personalInfo.summary}</p>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#4f46e5' }}>
                Expérience
              </h2>
              <div className="space-y-4 relative pl-4">
                <div className="absolute left-1 top-0 bottom-0 w-0.5 rounded-full" style={{ background: 'linear-gradient(180deg, #4f46e5 0%, #06b6d4 100%)' }} />
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-3 top-1 w-2.5 h-2.5 rounded-full" style={{ background: '#4f46e5', border: '2px solid white' }} />
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Poste'}</h3>
                        <p className="text-xs font-semibold" style={{ color: '#4f46e5' }}>{exp.company || 'Entreprise'}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap ml-3">
                        {formatDate(exp.startDate)} – {exp.current ? 'Présent' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-[10px] leading-relaxed whitespace-pre-line mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#4f46e5' }}>
                Formation
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="pl-4" style={{ borderLeft: '3px solid #06b6d4' }}>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}
                    </h3>
                    <p className="text-xs" style={{ color: '#4f46e5' }}>{edu.school || 'Établissement'}</p>
                    <p className="text-[10px] text-gray-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                    {edu.description && <p className="text-gray-700 text-[10px] mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const projectsSection = (projects || []).length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#4f46e5' }}>
                Projets
              </h2>
              <div className="space-y-3">
                {(projects || []).map((p) => (
                  <div key={p.id} className="p-2 rounded-lg" style={{ background: 'rgba(79,70,229,0.04)', borderLeft: '3px solid #818cf8' }}>
                    <h3 className="font-bold text-gray-900 text-xs">{p.name}</h3>
                    {p.description && <p className="text-gray-700 text-[10px] mt-0.5">{p.description}</p>}
                    {p.url && <p className="text-[9px] mt-0.5" style={{ color: '#4f46e5' }}>{p.url}</p>}
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
          <div className="text-center py-12 text-gray-400">
            <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
