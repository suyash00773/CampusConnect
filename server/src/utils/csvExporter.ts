export interface RegistrationExportRow {
  registrationId: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: string;
  fullName: string;
  email: string;
  college: string;
  academicYear: string;
  phone: string;
  status: string;
  notes?: string;
  registeredAt: string;
}

export const exportRegistrationsToCsv = (rows: RegistrationExportRow[]): string => {
  const headers = [
    'Registration ID',
    'Event Title',
    'Category',
    'Event Date',
    'Full Name',
    'Email Address',
    'College / University',
    'Academic Year',
    'Phone Number',
    'Status',
    'Notes',
    'Registered At',
  ];

  const escapeCell = (value: any): string => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const csvLines = [headers.join(',')];

  for (const row of rows) {
    const line = [
      escapeCell(row.registrationId),
      escapeCell(row.eventTitle),
      escapeCell(row.eventCategory),
      escapeCell(row.eventDate),
      escapeCell(row.fullName),
      escapeCell(row.email),
      escapeCell(row.college),
      escapeCell(row.academicYear),
      escapeCell(row.phone),
      escapeCell(row.status),
      escapeCell(row.notes || ''),
      escapeCell(row.registeredAt),
    ];
    csvLines.push(line.join(','));
  }

  return csvLines.join('\r\n');
};
