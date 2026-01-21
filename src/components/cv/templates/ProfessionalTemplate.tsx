import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ProfessionalTemplateProps {
  data: CVData;
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function ProfessionalTemplate({ data }: ProfessionalTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;

  return (
    <div 
      className="bg-white text-gray-900 min-h-full" 
      style={{ 
        fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5'
      }}
    >
      {/* Modern Header - Full Width with Photo Overlay */}
      <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 text-white px-8 pt-8 pb-6">
        <div className="flex items-start gap-6">
          {/* Photo */}
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Photo"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl flex-shrink-0"
            />
          )}
          
          {/* Name and Title */}
          <div className="flex-1 pt-2">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700 }}>
              {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
            </h1>
            <p className="text-slate-200 text-lg font-medium mb-3">
              {personalInfo.title || 'Titre professionnel'}
            </p>
            
            {/* Contact Info - Horizontal in Header */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-slate-200">
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
                  <span className="truncate max-w-[150px]">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]">{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex">
        {/* Left Column - Skills & Languages (Compact) */}
        <div className="w-48 bg-slate-50 p-5 space-y-5">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b-2 border-slate-800">
                Compétences
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div 
                    key={skill.id} 
                    className="text-[10px] text-slate-700 font-medium py-1.5 px-2 rounded bg-slate-100 border-l-2 border-slate-700"
                  >
                    {skill.name || 'Compétence'}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b-2 border-slate-800">
                Langues
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id}>
                    <div className="text-[10px] text-slate-800 font-semibold">{lang.name || 'Langue'}</div>
                    <div className="text-[9px] text-slate-600">{lang.level}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Main Content */}
        <div className="flex-1 p-6 space-y-5">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2.5 pb-1.5 border-b-2 border-slate-800">
                Profil Professionnel
              </h2>
              <p className="text-gray-700 text-[10px] leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b-2 border-slate-800">
                Expérience Professionnelle
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-slate-300">
                    {/* Timeline dot */}
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-700" />
                    
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-xs">{exp.position || 'Poste'}</h3>
                        <p className="text-slate-700 font-semibold text-[10px]">{exp.company || 'Entreprise'}</p>
                      </div>
                      <p className="text-gray-600 text-[10px] font-medium whitespace-nowrap ml-4 bg-slate-100 px-2 py-0.5 rounded">
                        {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-[10px] leading-relaxed mt-1.5 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b-2 border-slate-800">
                Formation
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-4 border-l-2 border-slate-300">
                    {/* Timeline dot */}
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-700" />
                    
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-xs">
                          {edu.degree || 'Diplôme'}{edu.field && ` - ${edu.field}`}
                        </h3>
                        <p className="text-slate-700 font-semibold text-[10px]">{edu.school || 'Établissement'}</p>
                      </div>
                      <p className="text-gray-600 text-[10px] font-medium whitespace-nowrap ml-4 bg-slate-100 px-2 py-0.5 rounded">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 text-[10px] mt-1.5 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {!hasContent && (
            <div className="text-center py-12 text-gray-400 text-sm">
              <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}