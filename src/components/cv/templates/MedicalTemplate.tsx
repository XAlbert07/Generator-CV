import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface MedicalTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function MedicalTemplate({ data, sectionOrder }: MedicalTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );
  const mainOrder = order.filter((s) => s === 'summary' || s === 'experience' || s === 'education' || s === 'projects');
  const sideOrder = order.filter((s) => s === 'skills' || s === 'languages' || s === 'certifications');

  const teal = '#0d9488';
  const tealLight = '#14b8a6';

  return (
    <div
      className="bg-white text-gray-900 min-h-full flex"
      style={{
        fontFamily: "'Lato', 'Inter', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.6',
      }}
    >
      {/* Main content — left, wider */}
      <div className="flex-1 p-7 space-y-5">
        {/* Header */}
        <div className="pb-4" style={{ borderBottom: `2px solid ${teal}` }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
          </h1>
          <p className="text-sm font-medium mb-3" style={{ color: teal }}>
            {personalInfo.title || 'Professionnel de santé'}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-600">
            {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: teal }} />{personalInfo.email}</span>}
            {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: teal }} />{personalInfo.phone}</span>}
            {personalInfo.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: teal }} />{personalInfo.address}</span>}
            {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" style={{ color: teal }} />{personalInfo.linkedin}</span>}
            {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: teal }} />{personalInfo.website}</span>}
          </div>
        </div>

        {/* Sections */}
        {(() => {
          const summarySection = personalInfo.summary ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: teal }}>Profil</h2>
              <p className="text-gray-700 text-[10px] leading-relaxed">{personalInfo.summary}</p>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: teal }}>Expérience clinique</h2>
              <div className="space-y-3.5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="pl-3" style={{ borderLeft: `2px solid ${tealLight}40` }}>
                    <div className="flex justify-between items-start mb-0.5">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs">{exp.position || 'Poste'}</h3>
                        <p className="text-[10px] font-medium" style={{ color: teal }}>{exp.company || 'Établissement'}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap ml-3">
                        {formatDate(exp.startDate)} – {exp.current ? 'Présent' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && <p className="text-gray-700 text-[10px] leading-relaxed whitespace-pre-line mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: teal }}>Formation</h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="pl-3" style={{ borderLeft: `2px solid ${tealLight}40` }}>
                    <h3 className="font-bold text-gray-900 text-xs">{edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}</h3>
                    <p className="text-[10px] font-medium" style={{ color: teal }}>{edu.school || 'Université'}</p>
                    <p className="text-[10px] text-gray-500">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                    {edu.description && <p className="text-gray-600 text-[10px] mt-0.5">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: summarySection, experience: experienceSection, education: educationSection,
            projects: null, skills: null, languages: null, certifications: null,
          };
          return mainOrder.map((id) => map[id]).filter(Boolean);
        })()}

        {!hasContent && (
          <div className="text-center py-12 text-gray-400"><p>Remplissez le formulaire pour voir votre CV</p></div>
        )}
      </div>

      {/* Right sidebar — clean, medical-style */}
      <div
        className="p-5 flex flex-col"
        style={{
          width: '72mm',
          background: `linear-gradient(180deg, ${teal}08, ${teal}03)`,
          borderLeft: `1px solid ${teal}20`,
        }}
      >
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Photo"
            className="w-24 h-24 rounded-xl object-cover mx-auto mb-5 shadow-sm"
            style={{ border: `2px solid ${teal}` }}
          />
        )}

        {(() => {
          const skillsBlock = skills.length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-wider font-bold mb-2.5" style={{ color: teal }}>Spécialités</h3>
              <div className="space-y-1.5">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-medium text-gray-700"
                    style={{ background: `${teal}10`, border: `1px solid ${teal}20` }}
                  >
                    {skill.name || 'Compétence'}
                  </div>
                ))}
              </div>
            </div>
          ) : null;

          const languagesBlock = languages.length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-wider font-bold mb-2.5" style={{ color: teal }}>Langues</h3>
              <div className="space-y-1.5">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-[10px]">
                    <span className="font-medium text-gray-700">{lang.name || 'Langue'}</span>
                    <span className="text-gray-500">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null;

          const certsBlock = (certifications || []).length > 0 ? (
            <div className="mb-5">
              <h3 className="text-[10px] uppercase tracking-wider font-bold mb-2.5" style={{ color: teal }}>Certifications</h3>
              <div className="space-y-2">
                {(certifications || []).map((cert) => (
                  <div key={cert.id} className="text-[10px]">
                    <p className="font-semibold text-gray-800">{cert.name}</p>
                    <p className="text-gray-500">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: null, experience: null, education: null, projects: null,
            skills: skillsBlock, languages: languagesBlock, certifications: certsBlock,
          };
          return sideOrder.map((id) => map[id]).filter(Boolean);
        })()}
      </div>
    </div>
  );
}
