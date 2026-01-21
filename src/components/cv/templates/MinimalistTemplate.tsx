import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface MinimalistTemplateProps {
  data: CVData;
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function MinimalistTemplate({ data }: MinimalistTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;

  return (
    <div 
      className="bg-white text-gray-900 min-h-full" 
      style={{ 
        fontFamily: "'Lato', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '10pt',
        lineHeight: '1.6'
      }}
    >
      {/* Minimalist Header */}
      <div className="pt-10 pb-8 px-10 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight" style={{ fontFamily: "'Lato', sans-serif", fontWeight: 300, letterSpacing: '-0.5px' }}>
              {personalInfo.firstName || 'Prénom'} <span className="font-normal">{personalInfo.lastName || 'Nom'}</span>
            </h1>
            <p className="text-gray-600 text-base font-light mb-4">
              {personalInfo.title || 'Titre professionnel'}
            </p>
          </div>
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
          )}
        </div>

        {/* Contact - Minimalist horizontal */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 mt-4">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-10 py-8 space-y-6">
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
              À propos
            </h2>
            <p className="text-gray-700 text-xs leading-relaxed max-w-3xl">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Expérience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex gap-6">
                  <div className="flex-shrink-0 w-24 text-right">
                    <p className="text-gray-500 text-xs font-light">
                      {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{exp.position || 'Poste'}</h3>
                    <p className="text-gray-600 text-xs mb-2">{exp.company || 'Entreprise'}</p>
                    {exp.description && (
                      <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">
              Formation
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex gap-6">
                  <div className="flex-shrink-0 w-24 text-right">
                    <p className="text-gray-500 text-xs font-light">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">
                      {edu.degree || 'Diplôme'}{edu.field && ` - ${edu.field}`}
                    </h3>
                    <p className="text-gray-600 text-xs">{edu.school || 'Établissement'}</p>
                    {edu.description && (
                      <p className="text-gray-700 text-xs mt-1 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Languages */}
        <div className="grid grid-cols-2 gap-8">
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="px-3 py-2 rounded text-xs text-gray-700 font-medium"
                    style={{
                      background: 'rgba(17, 24, 39, 0.05)',
                      borderLeft: '2px solid #111827'
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
              <h2 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
                Langues
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-xs">
                    <span className="text-gray-700 font-medium">{lang.name || 'Langue'}</span>
                    <span className="text-gray-500">{lang.level}</span>
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
