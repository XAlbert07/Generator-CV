import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PhotoUploader } from './PhotoUploader';
import { PersonalInfo } from '@/types/cv';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  return (
    <div className="form-section space-y-5 animate-fade-up">
      <h3 className="cv-section-title flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Informations personnelles
      </h3>

      <PhotoUploader
        photo={data.photo}
        onPhotoChange={(photo) => onChange({ photo })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            placeholder="Albert"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            placeholder="Sama"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre professionnel</Label>
        <Input
          id="title"
          placeholder="Développeur web"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="albert.sama@email.com"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Téléphone
          </Label>
          <Input
            id="phone"
            placeholder="+226 04 37 44 34"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Adresse
        </Label>
        <Input
          id="address"
          placeholder="Koudougou, Burkina Faso"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/albertsama"
            value={data.linkedin || ''}
            onChange={(e) => onChange({ linkedin: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Site web
          </Label>
          <Input
            id="website"
            placeholder="www.albertsama.com"
            value={data.website || ''}
            onChange={(e) => onChange({ website: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Résumé professionnel</Label>
        <Textarea
          id="summary"
          placeholder="Décrivez brièvement votre parcours et vos objectifs..."
          value={data.summary}
          onChange={(e) => onChange({ summary: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );
}
