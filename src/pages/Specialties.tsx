import React from 'react';
import { useTranslation } from 'react-i18next';
import SpecialtiesNl from './Specialties.nl';
import SpecialtiesEn from './Specialties.en';

const Specialties = () => {
  const { i18n } = useTranslation();
  const isNl = i18n.language.startsWith('nl');

  return isNl ? <SpecialtiesNl /> : <SpecialtiesEn />;
};

export default Specialties;
