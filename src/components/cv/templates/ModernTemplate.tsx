import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ModernTemplateProps {
  data: CVData;
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;

  return (
    <div 
      className="bg-white text-gray-900 min-h-full" 
      style={{ 
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5'
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white/30"
            />
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
              {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
            </h1>
            <p className="text-blue-50 text-lg mt-1 font-medium">
              {personalInfo.title || 'Titre professionnel'}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-xs text-blue-50">
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
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-xs text-blue-50">
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

      <div className="p-6 sm:p-8 space-y-5">
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
              Profil professionnel
            </h2>
            <p className="text-gray-700 text-xs leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
              Expérience professionnelle
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Poste'}</h3>
                      <p className="text-blue-600 font-semibold text-xs">{exp.company || 'Entreprise'}</p>
                    </div>
                    <p className="text-gray-600 text-xs font-medium whitespace-nowrap sm:ml-4">
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
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
              Formation
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {edu.degree || 'Diplôme'}{edu.field && ` - ${edu.field}`}
                      </h3>
                      <p className="text-blue-600 font-semibold text-xs">{edu.school || 'Établissement'}</p>
                    </div>
                    <p className="text-gray-600 text-xs font-medium whitespace-nowrap sm:ml-4">
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
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="px-3 py-2 rounded text-xs text-gray-700 font-medium"
                    style={{
                      background: 'rgba(37, 99, 235, 0.08)',
                      borderLeft: '3px solid #2563eb'
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
              <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">
                Langues
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center text-xs">
                    <span className="text-gray-700 font-medium">{lang.name || 'Langue'}</span>
                    <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {!hasContent && (
          <div className="text-center py-12 text-gray-400">
            <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
