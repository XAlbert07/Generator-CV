import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface CreativeTemplateProps {
  data: CVData;
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  return `${month}/${year}`;
}

export function CreativeTemplate({ data }: CreativeTemplateProps) {
  const { personalInfo, experiences, education, skills, languages } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;

  return (
    <div 
      className="bg-white text-gray-900 min-h-full flex" 
      style={{ 
        fontFamily: "'Poppins', 'Inter', sans-serif",
        fontSize: '10pt',
        lineHeight: '1.5'
      }}
    >
      {/* Elegant Sidebar - Deep Navy & Gold Accents */}
      <div 
        className="text-white p-7 w-72"
        style={{
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        }}
      >
        {/* Photo & Name - Elegant Presentation */}
        <div className="text-center mb-8">
          {personalInfo.photo ? (
            <div className="relative inline-block">
              <img
                src={personalInfo.photo}
                alt="Photo"
                className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 shadow-2xl"
                style={{ borderColor: '#f59e0b' }}
              />
              <div 
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#f59e0b' }}
              >
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          ) : (
            <div 
              className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
            >
              {(personalInfo.firstName?.[0] || 'P')}
              {(personalInfo.lastName?.[0] || 'N')}
            </div>
          )}
          <h1 className="text-2xl font-bold mb-0.5" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#f59e0b' }}>
            {personalInfo.firstName || 'Prénom'}
          </h1>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#f59e0b' }}>
            {personalInfo.lastName || 'Nom'}
          </h1>
          <div 
            className="h-1 w-16 mx-auto mb-3 rounded-full"
            style={{ background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' }}
          />
          <p className="text-slate-300 text-sm font-medium leading-tight">
            {personalInfo.title || 'Titre professionnel'}
          </p>
        </div>

        {/* Contact - Refined Style */}
        <div className="space-y-3 text-xs mb-7 pb-7 border-b border-slate-700">
          <h3 className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: '#f59e0b' }}>
            Contact
          </h3>
          {personalInfo.email && (
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <span className="text-slate-300 break-all text-[10px] leading-relaxed">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
              <span className="text-slate-300 text-[10px]">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <span className="text-slate-300 text-[10px] leading-relaxed">{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-start gap-2.5">
              <Linkedin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <span className="text-slate-300 break-all text-[10px] leading-relaxed">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
              <span className="text-slate-300 break-all text-[10px] leading-relaxed">{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Skills - Elegant Cards */}
        {skills.length > 0 && (
          <div className="mb-7 pb-7 border-b border-slate-700">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: '#f59e0b' }}>
              Compétences
            </h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div 
                  key={skill.id} 
                  className="px-3 py-2 rounded-lg text-[10px] font-medium text-slate-200 backdrop-blur-sm"
                  style={{
                    background: 'rgba(248, 250, 252, 0.05)',
                    borderLeft: '3px solid #f59e0b',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {skill.name || 'Compétence'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages - Minimalist */}
        {languages.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: '#f59e0b' }}>
              Langues
            </h3>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.id}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-200 text-[10px] font-semibold">{lang.name || 'Langue'}</span>
                    <span className="text-[9px] font-medium" style={{ color: '#fbbf24' }}>{lang.level}</span>
                  </div>
                  <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: lang.level === 'Natif' ? '100%' : 
                               lang.level === 'Courant' ? '90%' :
                               lang.level === 'Avancé' ? '75%' :
                               lang.level === 'Intermédiaire' ? '60%' : '40%',
                        background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Clean & Modern */}
      <div className="flex-1 p-8 space-y-6">
        {/* Summary with Accent */}
        {personalInfo.summary && (
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-1.5 h-8 rounded-full"
                style={{ background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)' }}
              />
              <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: '#1e293b' }}>
                À propos
              </h2>
            </div>
            <p className="text-gray-700 text-[10px] leading-relaxed pl-6">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience with Timeline */}
        {experiences.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-1.5 h-8 rounded-full"
                style={{ background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)' }}
              />
              <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: '#1e293b' }}>
                Expérience Professionnelle
              </h2>
            </div>
            <div className="space-y-5 relative pl-6">
              <div 
                className="absolute left-3 top-0 bottom-0 w-0.5 rounded-full"
                style={{ background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%)' }}
              />
              {experiences.map((exp) => (
                <div key={exp.id} className="pl-6 relative">
                  <div 
                    className="absolute left-0 top-1.5 w-3 h-3 rounded-full shadow-lg"
                    style={{ 
                      background: '#f59e0b',
                      transform: 'translateX(-18px)',
                      border: '2px solid white'
                    }}
                  />
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm">{exp.position || 'Poste'}</h3>
                      <p className="font-semibold text-xs" style={{ color: '#f59e0b' }}>{exp.company || 'Entreprise'}</p>
                    </div>
                    <p 
                      className="text-[10px] px-3 py-1 rounded-full font-semibold whitespace-nowrap ml-4"
                      style={{ 
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        color: '#92400e'
                      }}
                    >
                      {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-[10px] leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education - Clean Design */}
        {education.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-1.5 h-8 rounded-full"
                style={{ background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)' }}
              />
              <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: '#1e293b' }}>
                Formation
              </h2>
            </div>
            <div className="space-y-4 pl-6">
              {education.map((edu) => (
                <div 
                  key={edu.id} 
                  className="pl-4 rounded-r-lg py-2"
                  style={{ borderLeft: '3px solid #f59e0b', background: 'rgba(245, 158, 11, 0.03)' }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm">
                        {edu.degree || 'Diplôme'}{edu.field && ` - ${edu.field}`}
                      </h3>
                      <p className="font-semibold text-xs" style={{ color: '#f59e0b' }}>{edu.school || 'Établissement'}</p>
                    </div>
                    <p 
                      className="text-[10px] px-3 py-1 rounded-full font-semibold whitespace-nowrap ml-4"
                      style={{ 
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        color: '#92400e'
                      }}
                    >
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
          <div className="text-center py-12 text-gray-400">
            <p>Remplissez le formulaire pour voir votre CV apparaître ici</p>
          </div>
        )}
      </div>
    </div>
  );
}