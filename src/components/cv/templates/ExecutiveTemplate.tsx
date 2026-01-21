import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ExecutiveTemplateProps {
  data: CVData;
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function ExecutiveTemplate({ data }: ExecutiveTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;

  return (
    <div 
      className="bg-white text-gray-900 min-h-full" 
      style={{ 
        fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5'
      }}
    >
      {/* Header with accent bar */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-900 via-blue-900 to-navy-900" />
        <div className="pt-8 pb-6 px-8">
          <div className="flex items-start gap-6">
            {personalInfo.photo && (
              <img
                src={personalInfo.photo}
                alt="Photo"
                className="w-28 h-28 rounded-sm object-cover border-2 border-gray-200 shadow-sm"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700 }}>
                {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
              </h1>
              <p className="text-blue-900 text-lg font-medium mb-4">
                {personalInfo.title || 'Titre professionnel'}
              </p>
              
              {/* Contact Info - Compact */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-700">
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                    <span className="truncate">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                    <span className="truncate">{personalInfo.address}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                    <span className="truncate">{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                    <span className="truncate">{personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2 border-b border-blue-900 pb-1">
              Profil professionnel
            </h2>
            <p className="text-gray-700 text-xs leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 border-b border-blue-900 pb-1">
              Expérience professionnelle
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-blue-200">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-900" />
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Poste'}</h3>
                      <p className="text-blue-900 font-semibold text-xs">{exp.company || 'Entreprise'}</p>
                    </div>
                    <p className="text-gray-600 text-xs font-medium whitespace-nowrap ml-4">
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
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 border-b border-blue-900 pb-1">
              Formation
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-blue-200">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-900" />
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {edu.degree || 'Diplôme'}{edu.field && ` - ${edu.field}`}
                      </h3>
                      <p className="text-blue-900 font-semibold text-xs">{edu.school || 'Établissement'}</p>
                    </div>
                    <p className="text-gray-600 text-xs font-medium whitespace-nowrap ml-4">
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
        )}

        {/* Skills & Languages */}
        <div className="grid grid-cols-2 gap-6">
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 border-b border-blue-900 pb-1">
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="px-3 py-2 rounded text-xs text-gray-700 font-medium"
                    style={{
                      background: 'rgba(30, 58, 138, 0.08)',
                      borderLeft: '3px solid #1e3a8a'
                    }}
                  >
                    {skill.name || 'Compétence'}
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3 border-b border-blue-900 pb-1">
                Langues
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-xs">
                    <span className="text-gray-700 font-medium">{lang.name || 'Langue'}</span>
                    <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {!hasContent && (
          <div className="text-center py-12 text-gray-400 text-sm">
            <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
