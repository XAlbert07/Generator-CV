import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface CorporateTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function CorporateTemplate({ data, sectionOrder }: CorporateTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  return (
    <div 
      className="bg-white text-gray-900 min-h-full" 
      style={{ 
        fontFamily: "'Calibri', 'Arial', sans-serif",
        fontSize: '11pt',
        lineHeight: '1.5'
      }}
    >
      {/* Corporate Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Calibri', sans-serif", fontWeight: 700 }}>
                {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
              </h1>
              <p className="text-indigo-200 text-lg font-medium">
                {personalInfo.title || 'Titre professionnel'}
              </p>
            </div>
            {personalInfo.photo && (
              <img
                src={personalInfo.photo}
                alt="Photo"
                className="w-28 h-28 rounded object-cover border-4 border-indigo-800 shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Contact Bar */}
        <div className="bg-indigo-900 px-8 py-3">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{personalInfo.address}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span>{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {(() => {
          const summarySection = personalInfo.summary ? (
            <section>
              <h2 className="text-base font-bold text-indigo-950 mb-3 flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-950" />
                Profil professionnel
              </h2>
              <p className="text-gray-700 text-xs leading-relaxed pl-3">{personalInfo.summary}</p>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2 className="text-base font-bold text-indigo-950 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-950" />
                Expérience professionnelle
              </h2>
              <div className="space-y-4 pl-3">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-indigo-200 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Poste'}</h3>
                        <p className="text-indigo-900 font-semibold text-xs">{exp.company || 'Entreprise'}</p>
                      </div>
                      <p className="text-gray-600 text-xs font-medium whitespace-nowrap ml-4 bg-gray-100 px-2 py-1 rounded">
                        {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-xs leading-relaxed mt-2 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              <h2 className="text-base font-bold text-indigo-950 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-indigo-950" />
                Formation
              </h2>
              <div className="space-y-3 pl-3">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-indigo-200 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {edu.degree || 'Diplôme'}{edu.field && ` - ${edu.field}`}
                        </h3>
                        <p className="text-indigo-900 font-semibold text-xs">{edu.school || 'Établissement'}</p>
                      </div>
                      <p className="text-gray-600 text-xs font-medium whitespace-nowrap ml-4 bg-gray-100 px-2 py-1 rounded">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 text-xs mt-1 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const skillsSection = skills.length > 0 ? (
            <section>
              <h2 className="text-base font-bold text-indigo-950 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-indigo-950" />
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="px-3 py-2 rounded text-xs text-gray-700 font-semibold"
                    style={{
                      background: 'rgba(30, 27, 75, 0.08)',
                      borderLeft: '3px solid #1e1b4b',
                    }}
                  >
                    {skill.name || 'Compétence'}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const languagesSection = languages.length > 0 ? (
            <section>
              <h2 className="text-base font-bold text-indigo-950 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-indigo-950" />
                Langues
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-xs">
                    <span className="text-gray-700 font-semibold">{lang.name || 'Langue'}</span>
                    <span className="text-indigo-900 bg-indigo-50 px-2 py-1 rounded font-medium">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const sectionMap: Record<CVSectionId, React.ReactNode> = {
            summary: summarySection,
            experience: experienceSection,
            education: educationSection,
            skills: skillsSection,
            languages: languagesSection,
          };

          const blocks: React.ReactNode[] = [];
          for (let i = 0; i < order.length; i++) {
            const id = order[i];
            const next = order[i + 1];

            if (
              (id === 'skills' && next === 'languages') ||
              (id === 'languages' && next === 'skills')
            ) {
              const a = sectionMap[id];
              const b = sectionMap[next];
              if (a && b) {
                blocks.push(
                  <div key={`${id}-${next}`} className="grid grid-cols-2 gap-6 pl-3">
                    {a}
                    {b}
                  </div>
                );
              } else {
                if (a) blocks.push(<React.Fragment key={id}>{a}</React.Fragment>);
                if (b) blocks.push(<React.Fragment key={next}>{b}</React.Fragment>);
              }
              i++;
              continue;
            }

            const node = sectionMap[id];
            if (node) blocks.push(<React.Fragment key={id}>{node}</React.Fragment>);
          }

          return blocks;
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
