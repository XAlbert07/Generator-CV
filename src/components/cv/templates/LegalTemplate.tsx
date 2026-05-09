import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface LegalTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Janv.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function LegalTemplate({ data, sectionOrder }: LegalTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || experiences.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  const bordeaux = '#7f1d1d';
  const gold = '#b8860b';

  return (
    <div
      className="bg-white text-gray-900 min-h-full"
      style={{
        fontFamily: "'Lato', 'Georgia', serif",
        fontSize: '10pt',
        lineHeight: '1.6',
      }}
    >
      {/* Formal header with double border */}
      <div className="px-8 pt-8 pb-5" style={{ borderBottom: `3px double ${bordeaux}` }}>
        <div className="text-center">
          <h1
            className="text-3xl font-bold mb-1 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif", color: bordeaux }}
          >
            {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'NOM'}
          </h1>
          <div className="h-px w-20 mx-auto my-2" style={{ background: gold }} />
          <p className="text-sm font-medium tracking-wide" style={{ color: '#57534e' }}>
            {personalInfo.title || 'Avocat(e) au Barreau'}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[10px]" style={{ color: '#78716c' }}>
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: bordeaux }} />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: bordeaux }} />{personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: bordeaux }} />{personalInfo.address}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" style={{ color: bordeaux }} />{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: bordeaux }} />{personalInfo.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-5">
        {(() => {
          const summarySection = personalInfo.summary ? (
            <section>
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: bordeaux }}
              >
                Profil
              </h2>
              <div className="h-px w-full mb-2" style={{ background: `${gold}40` }} />
              <p className="text-[10px] leading-relaxed text-gray-700 italic">{personalInfo.summary}</p>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: bordeaux }}
              >
                Expérience professionnelle
              </h2>
              <div className="h-px w-full mb-3" style={{ background: `${gold}40` }} />
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="pl-4" style={{ borderLeft: `2px solid ${gold}60` }}>
                    <div className="flex justify-between items-start mb-0.5">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xs">{exp.position || 'Poste'}</h3>
                        <p className="text-[10px] font-semibold" style={{ color: bordeaux }}>{exp.company || 'Cabinet / Entreprise'}</p>
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap ml-3 italic">
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
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: bordeaux }}
              >
                Formation
              </h2>
              <div className="h-px w-full mb-3" style={{ background: `${gold}40` }} />
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="pl-4" style={{ borderLeft: `2px solid ${gold}60` }}>
                    <h3 className="font-bold text-gray-900 text-xs">{edu.degree || 'Diplôme'}{edu.field && ` – ${edu.field}`}</h3>
                    <p className="text-[10px]" style={{ color: bordeaux }}>{edu.school || 'Université'}</p>
                    <p className="text-[10px] text-gray-500 italic">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                    {edu.description && <p className="text-gray-600 text-[10px] mt-0.5">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const skillsSection = skills.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Playfair Display', serif", color: bordeaux }}>
                Domaines de compétence
              </h2>
              <div className="h-px w-full mb-2" style={{ background: `${gold}40` }} />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill.id} className="px-2.5 py-1 text-[10px] font-medium" style={{ background: `${bordeaux}08`, color: bordeaux, border: `1px solid ${bordeaux}20` }}>
                    {skill.name || 'Compétence'}
                  </span>
                ))}
              </div>
            </section>
          ) : null;

          const languagesSection = languages.length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Playfair Display', serif", color: bordeaux }}>Langues</h2>
              <div className="h-px w-full mb-2" style={{ background: `${gold}40` }} />
              <div className="flex gap-4 flex-wrap">
                {languages.map((lang) => (
                  <div key={lang.id} className="text-[10px]">
                    <span className="font-semibold text-gray-900">{lang.name}</span>
                    <span className="text-gray-500 ml-1">– {lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const certsSection = (certifications || []).length > 0 ? (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "'Playfair Display', serif", color: bordeaux }}>Certifications & Barreaux</h2>
              <div className="h-px w-full mb-2" style={{ background: `${gold}40` }} />
              <div className="space-y-1">
                {(certifications || []).map((cert) => (
                  <div key={cert.id} className="text-[10px]">
                    <span className="font-semibold text-gray-900">{cert.name}</span>
                    <span className="text-gray-500"> – {cert.issuer}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: summarySection, experience: experienceSection, education: educationSection,
            projects: null, skills: skillsSection, languages: languagesSection, certifications: certsSection,
          };
          return order.map((id) => map[id]).filter(Boolean);
        })()}

        {!hasContent && (
          <div className="text-center py-12 text-gray-400"><p>Remplissez le formulaire</p></div>
        )}
      </div>
    </div>
  );
}
