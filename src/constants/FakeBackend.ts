import { defaultParams, list } from '@/constants/Constants';

interface Employment {
  title: string;
}

interface Subscription {
  status: 'active' | 'blocked' | 'idle';
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  employment: Employment;
  subscription: Subscription;
}

export interface BackendParams {
  searchTerm?: string;
  sortField?: keyof Person;
  sortOrder?: 'asc' | 'desc';
  currentPage?: number;
  itemsPerPage?: number;
}

export const fakeBackend = (
  params: Partial<BackendParams> = {}
): Promise<{ data: Person[]; total: number }> => {
  // Merge provided params with default params
  const finalParams: BackendParams = { ...defaultParams, ...params };
  const { searchTerm, sortField, sortOrder, currentPage, itemsPerPage } = finalParams;
  console.log({ params });
  return new Promise((resolve) => {
    setTimeout(() => {
      // Strip frontend-only properties from the data to simulate real backend response
      let data: Person[] = list.map((person) => person);

      // Search in all specified fields
      if (searchTerm) {
        data = data.filter(
          (person) =>
            person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.employment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            person.subscription.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort
      if (sortField) {
        data.sort((a, b) => {
          let aField: string | number;
          let bField: string | number;

          if (sortField === 'employment' || sortField.includes('employment')) {
            aField = a.employment.title;
            bField = b.employment.title;
          } else if (sortField === 'subscription') {
            aField = a.subscription.status;
            bField = b.subscription.status;
          } else {
            aField = a[sortField] as string | number;
            bField = b[sortField] as string | number;
          }

          if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
          if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Pagination
      const startIndex = currentPage && itemsPerPage ? (currentPage - 1) * itemsPerPage : 0;
      const paginatedData = itemsPerPage ? data.slice(startIndex, startIndex + itemsPerPage) : data;

      resolve({ data: paginatedData, total: searchTerm ? paginatedData.length : list.length });
    }, 500); // Simulate network delay
  });
};
