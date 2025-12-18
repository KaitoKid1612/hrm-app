import type { User, Company } from '@/types';

export const exportUsersToCSV = (users: User[], filename = 'users-export.csv') => {
  const headers = [
    'ID',
    'Name',
    'Email',
    'Role',
    'Status',
    'Phone',
    'City',
    'Country',
    'Active',
    'Email Verified',
    'Created At',
    'Last Login',
  ];

  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.role,
    user.status,
    user.phone || '',
    user.city || '',
    user.country || '',
    user.isActive ? 'Yes' : 'No',
    user.isEmailVerified ? 'Yes' : 'No',
    new Date(user.createdAt).toLocaleString(),
    user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const cellStr = String(cell);
          return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
            ? `"${cellStr.replace(/"/g, '""')}"`
            : cellStr;
        })
        .join(','),
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportUsersToJSON = (users: User[], filename = 'users-export.json') => {
  const dataToExport = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    phone: user.phone,
    city: user.city,
    country: user.country,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  }));

  const jsonContent = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Company export functions
export const exportCompaniesToCSV = (companies: Company[], filename = 'companies-export.csv') => {
  const headers = [
    'ID',
    'Name',
    'Type',
    'Size',
    'Industry',
    'Location',
    'Website',
    'Email',
    'Phone',
    'Verified',
    'Featured',
    'Active',
    'Founded Year',
    'Created At',
  ];

  const rows = companies.map((company) => [
    company.id,
    company.name,
    company.type || '',
    company.size || '',
    company.industry || '',
    company.location || '',
    company.website || '',
    company.email || '',
    company.phone || '',
    company.isVerified ? 'Yes' : 'No',
    company.isFeatured ? 'Yes' : 'No',
    company.isActive ? 'Yes' : 'No',
    company.foundedYear || '',
    new Date(company.createdAt).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const cellStr = String(cell);
          return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
            ? `"${cellStr.replace(/"/g, '""')}"`
            : cellStr;
        })
        .join(','),
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportCompaniesToJSON = (companies: Company[], filename = 'companies-export.json') => {
  const dataToExport = companies.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    type: company.type,
    size: company.size,
    description: company.description,
    website: company.website,
    logo: company.logo,
    coverImage: company.coverImage,
    industry: company.industry,
    foundedYear: company.foundedYear,
    location: company.location,
    email: company.email,
    phone: company.phone,
    linkedIn: company.linkedIn,
    facebook: company.facebook,
    twitter: company.twitter,
    isVerified: company.isVerified,
    isFeatured: company.isFeatured,
    isActive: company.isActive,
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
  }));

  const jsonContent = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
