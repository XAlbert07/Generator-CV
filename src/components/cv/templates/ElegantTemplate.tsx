import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe, User, Briefcase, Star, Languages as LanguagesIcon } from 'lucide-react';

interface ElegantTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Janv.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

function formatDateRange(startDate: string, endDate: string, isCurrent: boolean = false): string {
  const start = formatDate(startDate);
  const end = isCurrent ? 'Présent' : formatDate(endDate);
  return `${start} - ${end}`;
}


export function ElegantTemplate({ data, sectionOrder }: ElegantTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );
  const sidebarOrder = order.filter((s) => s === 'skills' || s === 'languages');
  const mainOrder = order.filter((s) => s === 'summary' || s === 'experience' || s === 'education');

  return (
    <div 
      className="bg-white text-gray-900 min-h-full flex" 
      style={{ 
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5',
        width: '210mm',
        minHeight: '297mm'
      }}
    >
      {/* Sidebar gauche avec photo et informations */}
      <div 
        className="text-white p-8 flex flex-col"
        style={{ 
          width: '80mm',
          background: 'linear-gradient(180deg, #1e3a5f 0%, #2d4a6b 100%)'
        }}
      >
        {/* Photo */}
        <div className="mb-8">
          {personalInfo.photo ? (
            <div 
              className="w-32 h-32 rounded-full overflow-hidden mx-auto"
              style={{
                border: '4px solid #c9a961',
                boxShadow: '0 8px 24px rgba(30, 58, 95, 0.3)'
              }}
            >
              <img
                src={personalInfo.photo}
                alt="Photo"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 0%' }}
              />
            </div>
          ) : (
            <div 
              className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-bold bg-white/10"
              style={{
                border: '4px solid #c9a961',
                boxShadow: '0 8px 24px rgba(30, 58, 95, 0.3)'
              }}
            >
              {(personalInfo.firstName?.[0] || 'P')}
              {(personalInfo.lastName?.[0] || 'N')}
            </div>
          )}
        </div>
        
        {/* Nom et titre */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700
            }}
          >
            {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
          </h1>
          <div 
            className="w-16 mx-auto mb-3"
            style={{
              height: '3px',
              background: 'linear-gradient(90deg, #c9a961 0%, #d4b877 100%)'
            }}
          />
          <p className="text-sm text-gray-200 font-light leading-relaxed">
            {personalInfo.title || 'Titre professionnel'}
          </p>
        </div>
        
        {/* Contact */}
        <div className="mb-8">
          <h2 
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <User className="w-5 h-5" style={{ color: '#fbbf24' }} />
            Contact
          </h2>
          <div className="space-y-3 text-sm">
            {personalInfo.phone && (
              <div className="flex items-center gap-3 text-gray-100">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center gap-3 text-gray-100">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <span className="break-all text-xs">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-center gap-3 text-gray-100">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <span>{personalInfo.address}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-3 text-gray-100">
                <Linkedin className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <span className="break-all text-xs">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-3 text-gray-100">
                <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
                <span className="break-all text-xs">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
        
        {(() => {
          const skillsBlock = skills.length > 0 ? (
            <div className="mb-8">
              <h2
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <Briefcase className="w-5 h-5" style={{ color: '#fbbf24' }} />
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="px-3 py-2 rounded text-sm text-gray-100"
                    style={{
                      background: 'rgba(201, 169, 97, 0.1)',
                      borderLeft: '3px solid #c9a961',
                    }}
                  >
                    {skill.name || 'Compétence'}
                  </div>
                ))}
              </div>
            </div>
          ) : null;

          const languagesBlock = languages.length > 0 ? (
            <div className="mt-auto">
              <h2
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <Star className="w-5 h-5" style={{ color: '#fbbf24' }} />
                Langues
              </h2>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang.id}
                    className="px-3 py-1 rounded-full text-xs text-gray-100"
                    style={{
                      background: 'rgba(251, 191, 36, 0.2)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    {lang.name || 'Langue'} {lang.level && `(${lang.level})`}
                  </span>
                ))}
              </div>
            </div>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: null,
            experience: null,
            education: null,
            skills: skillsBlock,
            languages: languagesBlock,
          };

          return sidebarOrder.map((id) => map[id]).filter(Boolean);
        })()}
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1 p-8 text-gray-800">
        {(() => {
          const divider = (
            <div
              className="w-24 mb-4"
              style={{
                height: '3px',
                background: 'linear-gradient(90deg, #c9a961 0%, #d4b877 100%)',
              }}
            />
          );

          const summaryBlock = personalInfo.summary ? (
            <div className="mb-8">
              {divider}
              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Profil Professionnel
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{personalInfo.summary}</p>
            </div>
          ) : null;

          const experienceBlock = experiences.length > 0 ? (
            <div className="mb-8">
              {divider}
              <h2
                className="text-2xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Expérience Professionnelle
              </h2>

              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-start gap-3 mb-2"
                    style={{
                      borderLeft: '2px solid #c9a961',
                      paddingLeft: '1rem',
                    }}
                  >
                    <div
                      className="rounded-full mt-1.5 flex-shrink-0"
                      style={{
                        width: '10px',
                        height: '10px',
                        background: '#c9a961',
                        border: '2px solid #1e3a5f',
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-900">{exp.position || 'Poste'}</h3>
                      <p className="text-xs text-gray-500 italic mb-2">
                        {exp.company || 'Entreprise'} •{' '}
                        {exp.current
                          ? `Aujourd'hui - ${new Date(exp.startDate).getFullYear()}`
                          : `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;

          const educationBlock = education.length > 0 ? (
            <div>
              {divider}
              <h2
                className="text-2xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Formation
              </h2>

              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    style={{
                      borderLeft: '2px solid #c9a961',
                      paddingLeft: '1rem',
                    }}
                  >
                    <h3 className="font-semibold text-base text-gray-900 mb-1">
                      {edu.degree || 'Diplôme'}
                      {edu.field && ` - ${edu.field}`}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {edu.school || 'Établissement'} • {formatDateRange(edu.startDate, edu.endDate, false)}
                    </p>
                    {edu.description && <p className="text-sm text-gray-700 leading-relaxed mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: summaryBlock,
            experience: experienceBlock,
            education: educationBlock,
            skills: null,
            languages: null,
          };

          return mainOrder.map((id) => map[id]).filter(Boolean);
        })()}

        {!hasContent && (
          <div className="text-center py-12 text-gray-400 text-sm">
            <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
