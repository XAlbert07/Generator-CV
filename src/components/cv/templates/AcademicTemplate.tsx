import React from 'react';
import { CVData, type CVSectionId, defaultSectionOrder } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface AcademicTemplateProps {
  data: CVData;
  sectionOrder?: CVSectionId[];
}

function formatDate(date: string): string {
  if (!date) return '';
  const [year, month] = date.split('-');
  const months = ['Janv.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export function AcademicTemplate({ data, sectionOrder }: AcademicTemplateProps) {
  const { personalInfo, experiences, education, skills, languages, projects, certifications } = data;
  const hasContent = personalInfo.firstName || personalInfo.lastName || education.length > 0;
  const order = (sectionOrder?.length ? sectionOrder : defaultSectionOrder).filter(
    (s): s is CVSectionId => !!s
  );

  const green = '#14532d';
  const cream = '#fef9ec';

  return (
    <div
      className="min-h-full"
      style={{
        fontFamily: "'Merriweather', 'Georgia', serif",
        fontSize: '9.5pt',
        lineHeight: '1.55',
        background: cream,
        color: '#1c1917',
      }}
    >
      {/* Dense academic header */}
      <div className="px-7 pt-7 pb-4" style={{ borderBottom: `2px solid ${green}` }}>
        <h1 className="text-2xl font-bold mb-0.5" style={{ color: green }}>
          {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'NOM'}
        </h1>
        <p className="text-xs italic" style={{ color: '#57534e' }}>
          {personalInfo.title || 'Chercheur / Enseignant-chercheur'}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px]" style={{ color: '#78716c' }}>
          {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" style={{ color: green }} />{personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: green }} />{personalInfo.phone}</span>}
          {personalInfo.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" style={{ color: green }} />{personalInfo.address}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" style={{ color: green }} />{personalInfo.linkedin}</span>}
          {personalInfo.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" style={{ color: green }} />{personalInfo.website}</span>}
        </div>
      </div>

      {/* Dense body */}
      <div className="px-7 py-5 space-y-4">
        {(() => {
          let sectionNum = 0;
          const makeTitle = (title: string) => {
            sectionNum++;
            return (
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: green }}>
                {sectionNum}. {title}
              </h2>
            );
          };

          const summarySection = personalInfo.summary ? (
            <section>
              {makeTitle('Résumé')}
              <p className="text-[9.5pt] leading-relaxed italic" style={{ color: '#44403c' }}>{personalInfo.summary}</p>
            </section>
          ) : null;

          const educationSection = education.length > 0 ? (
            <section>
              {makeTitle('Formation')}
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="flex gap-2.5">
                    <span className="shrink-0 text-[9px] font-medium w-[80px] pt-0.5" style={{ color: '#78716c' }}>
                      {formatDate(edu.startDate)} –<br />{formatDate(edu.endDate)}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-[10px]" style={{ color: green }}>
                        {edu.degree || 'Diplôme'}{edu.field && `, ${edu.field}`}
                      </p>
                      <p className="text-[9.5pt]">{edu.school || 'Université'}</p>
                      {edu.description && <p className="text-[9pt] mt-0.5" style={{ color: '#57534e' }}>{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const experienceSection = experiences.length > 0 ? (
            <section>
              {makeTitle('Expérience académique')}
              <div className="space-y-2.5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-2.5">
                    <span className="shrink-0 text-[9px] font-medium w-[80px] pt-0.5" style={{ color: '#78716c' }}>
                      {formatDate(exp.startDate)} –<br />{exp.current ? 'Présent' : formatDate(exp.endDate)}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-[10px]">{exp.position || 'Poste'}</p>
                      <p className="text-[9.5pt]" style={{ color: green }}>{exp.company || 'Institution'}</p>
                      {exp.description && <p className="text-[9pt] whitespace-pre-line mt-0.5" style={{ color: '#57534e' }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const projectsSection = (projects || []).length > 0 ? (
            <section>
              {makeTitle('Publications & Projets')}
              <div className="space-y-1.5">
                {(projects || []).map((p) => (
                  <div key={p.id} className="text-[9.5pt]">
                    <p>
                      <span className="font-bold">{p.name}</span>
                      {p.description && <span className="italic" style={{ color: '#57534e' }}> – {p.description}</span>}
                    </p>
                    {p.url && <p className="text-[8pt]" style={{ color: green }}>{p.url}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;

          const skillsSection = skills.length > 0 ? (
            <section>
              {makeTitle('Domaines de recherche')}
              <p className="text-[9.5pt]">
                {skills.map((s) => s.name).filter(Boolean).join(' • ')}
              </p>
            </section>
          ) : null;

          const languagesSection = languages.length > 0 ? (
            <section>
              {makeTitle('Langues')}
              <p className="text-[9.5pt]">
                {languages.map((l) => `${l.name} (${l.level})`).join(', ')}
              </p>
            </section>
          ) : null;

          const certsSection = (certifications || []).length > 0 ? (
            <section>
              {makeTitle('Distinctions & Certifications')}
              <div className="space-y-0.5">
                {(certifications || []).map((cert) => (
                  <p key={cert.id} className="text-[9.5pt]">
                    <span className="font-bold">{cert.name}</span> – {cert.issuer}
                  </p>
                ))}
              </div>
            </section>
          ) : null;

          const map: Record<CVSectionId, React.ReactNode> = {
            summary: summarySection, education: educationSection, experience: experienceSection,
            projects: projectsSection, skills: skillsSection, languages: languagesSection,
            certifications: certsSection,
          };
          return order.map((id) => map[id]).filter(Boolean);
        })()}

        {!hasContent && (
          <div className="text-center py-12" style={{ color: '#a8a29e' }}><p>Remplissez le formulaire</p></div>
        )}
      </div>
    </div>
  );
}
