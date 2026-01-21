import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ClassicTemplateProps {
  data: CVData;
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;

  return (
    <div 
      className="bg-white text-gray-800 min-h-full" 
      style={{ 
        fontFamily: "'Merriweather', 'Georgia', serif",
        fontSize: '10pt',
        lineHeight: '1.6'
      }}
    >
      {/* Header */}
      <div className="text-center p-6 sm:p-8 border-b-2 border-gray-800">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Photo"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-gray-800"
          />
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide uppercase" style={{ fontFamily: "'Merriweather', serif", fontWeight: 700 }}>
          {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
        </h1>
        <p className="text-gray-700 text-lg mt-2 italic font-medium">
          {personalInfo.title || 'Titre professionnel'}
        </p>

        {/* Contact */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-gray-700">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {personalInfo.address}
            </span>
          )}
        </div>
        {(personalInfo.linkedin || personalInfo.website) && (
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-gray-700">
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {personalInfo.website}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-3 text-center border-b border-gray-300 pb-2">
              Profil professionnel
            </h2>
            <p className="text-gray-700 text-xs leading-relaxed text-center max-w-2xl mx-auto">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 text-center border-b border-gray-300 pb-2">
              Expérience professionnelle
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Poste'}</h3>
                      <p className="text-gray-700 italic text-xs">{exp.company || 'Entreprise'}</p>
                    </div>
                    <p className="text-gray-600 text-xs font-medium mt-1 sm:mt-0">
                      {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-xs mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4 text-center border-b border-gray-300 pb-2">
              Formation
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {edu.degree || 'Diplôme'}{edu.field && ` - ${edu.field}`}
                      </h3>
                      <p className="text-gray-700 italic text-xs">{edu.school || 'Établissement'}</p>
                    </div>
                    <p className="text-gray-600 text-xs font-medium mt-1 sm:mt-0">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-3 text-center border-b border-gray-300 pb-2">
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="px-3 py-2 rounded text-xs text-gray-700 font-medium text-center"
                    style={{
                      background: 'rgba(31, 41, 55, 0.08)',
                      borderLeft: '3px solid #1f2937'
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
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-3 text-center border-b border-gray-300 pb-2">
                Langues
              </h2>
              <ul className="space-y-2 text-center">
                {languages.map((lang) => (
                  <li key={lang.id} className="text-xs text-gray-700">
                    <span className="font-medium">{lang.name || 'Langue'}</span>
                    <span className="text-gray-600 italic ml-2">— {lang.level}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {!hasContent && (
          <div className="text-center py-12 text-gray-400 italic">
            <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
