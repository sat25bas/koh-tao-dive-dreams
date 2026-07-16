import React from 'react';
import { useTranslation } from 'react-i18next';
import SpecialtiesEn from './Specialties.en';
import SpecialtiesNl from './Specialties.nl';

const Specialties: React.FC = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  return isDutch ? <SpecialtiesNl /> : <SpecialtiesEn />;
};

export default Specialties;
