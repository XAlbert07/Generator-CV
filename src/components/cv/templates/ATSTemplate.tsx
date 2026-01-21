import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';

interface ATSTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  return `${months[parseInt(month) - 1]}/${year}`;
}

/**
 * ATS-Friendly Template
 * 
 * Design optimisé pour les systèmes de suivi des candidatures (ATS)
 * - Aucun graphique, couleur, ou élément décoratif
 * - Structure simple et claire
 * - Texte noir sur fond blanc uniquement
 * - Pas de colonnes, seulement du texte linéaire
 * - Headers en majuscules avec séparateurs simples
 * - Format facilement parsable par les robots
 */
export function ATSTemplate({ data, sectionOrder }: ATSTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  return (
    <div 
      className="bg-white text-black min-h-full p-12" 
      style={{ 
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        fontSize: '11pt',
        lineHeight: '1.6',
        color: '#000000'
      }}
    >
      {/* Header - Nom et contact */}
      <div className="text-center mb-6 pb-4" style={{ borderBottom: '2px solid #000000' }}>
        <h1 
          className="text-3xl font-bold mb-3 uppercase" 
          style={{ 
            fontFamily: "'Arial', sans-serif",
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          {personalInfo.firstName || 'PRÉNOM'} {personalInfo.lastName || 'NOM'}
        </h1>
        
        {personalInfo.title && (
          <p className="text-lg mb-3 font-semibold">{personalInfo.title}</p>
        )}
        
        <div className="text-sm space-y-1">
          {personalInfo.email && <p>Email: {personalInfo.email}</p>}
          {personalInfo.phone && <p>Téléphone: {personalInfo.phone}</p>}
          {personalInfo.address && <p>Adresse: {personalInfo.address}</p>}
          {personalInfo.linkedin && <p>LinkedIn: {personalInfo.linkedin}</p>}
          {personalInfo.website && <p>Site web: {personalInfo.website}</p>}
        </div>
      </div>

      {(() => {
        const summarySection = personalInfo.summary ? (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-3 uppercase pb-1"
              style={{ borderBottom: '1px solid #000000' }}
            >
              RÉSUMÉ PROFESSIONNEL
            </h2>
            <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
          </div>
        ) : null;

        const experienceSection = experiences.length > 0 ? (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-3 uppercase pb-1"
              style={{ borderBottom: '1px solid #000000' }}
            >
              EXPÉRIENCE PROFESSIONNELLE
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="font-bold text-base">{exp.position || 'Poste'}</div>
                  <div className="text-sm font-semibold">{exp.company || 'Entreprise'}</div>
                  <div className="text-sm text-gray-700 mb-2">
                    {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                  </div>
                  {exp.description && (
                    <p className="text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

        const educationSection = education.length > 0 ? (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-3 uppercase pb-1"
              style={{ borderBottom: '1px solid #000000' }}
            >
              FORMATION
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-base">
                    {edu.degree || 'Diplôme'}{edu.field && ` - ${edu.field}`}
                  </div>
                  <div className="text-sm font-semibold">{edu.school || 'Établissement'}</div>
                  <div className="text-sm text-gray-700 mb-1">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                  {edu.description && <p className="text-sm leading-relaxed">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

        const skillsSection = skills.length > 0 ? (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-3 uppercase pb-1"
              style={{ borderBottom: '1px solid #000000' }}
            >
              COMPÉTENCES
            </h2>
            <p className="text-sm">{skills.map((skill) => skill.name).filter(Boolean).join(' • ')}</p>
          </div>
        ) : null;

        const languagesSection = languages.length > 0 ? (
          <div className="mb-6">
            <h2
              className="text-lg font-bold mb-3 uppercase pb-1"
              style={{ borderBottom: '1px solid #000000' }}
            >
              LANGUES
            </h2>
            <div className="text-sm space-y-1">
              {languages.map((lang) => (
                <p key={lang.id}>
                  {lang.name || 'Langue'}: {lang.level}
                </p>
              ))}
            </div>
          </div>
        ) : null;

        const sectionMap: Record<CVSectionId, React.ReactNode> = {
          summary: summarySection,
          experience: experienceSection,
          education: educationSection,
          skills: skillsSection,
          languages: languagesSection,
        };

        return order.map((id) => sectionMap[id]).filter(Boolean);
      })()}
    </div>
  );
}