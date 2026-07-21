export type SpecialOfferBookingData = {
  course_title: string;
  preferred_date?: string;
  experience_level?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export function getOfferBookingDefaults(courseTitle: string, locale: string): SpecialOfferBookingData {
  const isDutch = locale.startsWith('nl');
  const baseMessage = isDutch
    ? `Ik wil meer informatie over deze special offer: ${courseTitle}.`
    : `I would like more information about this special offer: ${courseTitle}.`;

  return {
    course_title: courseTitle,
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    experience_level: '',
    message: baseMessage,
  };
}

export function buildOfferBookingPayload(values: Partial<SpecialOfferBookingData>, courseTitle: string, locale: string) {
  const defaults = getOfferBookingDefaults(courseTitle, locale);
  return {
    access_key: 'b42b4f7a-b0b3-4ba9-8197-cf5abe9f09e6',
    subject: 'New Special Offer Inquiry from Website',
    name: values.name ?? defaults.name,
    email: values.email ?? defaults.email,
    phone: values.phone ?? defaults.phone,
    course_title: values.course_title ?? defaults.course_title,
    preferred_date: values.preferred_date ?? defaults.preferred_date,
    experience_level: values.experience_level ?? defaults.experience_level,
    message: values.message ?? defaults.message,
  };
}
