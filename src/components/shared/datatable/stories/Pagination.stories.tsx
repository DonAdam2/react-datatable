import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useCallback, useEffect, useState } from 'react';

import Datatable from '../Datatable';
import { fakeBackend, Person } from '@/constants/FakeBackend';
import { getMyTeamsDatatableConfig } from '@/constants/MyTeamsDatatableConfig';
import CustomPagination from '@/components/customPagination/CustomPagination';
import usePagination from '@/hooks/usePagination';
import { StandardDatatableComponent } from '@/components/shared/datatable/stories/Datatable.stories';

const meta: Meta<typeof Datatable> = {
  title: 'Components/Datatable/Pagination',
  component: Datatable,
  excludeStories: ['StandardDatatableComponent'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Datatable>;

export const PaginationRangeSeparatorLabel: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (Separator "out of")',
      }}
      pagination={{
        rangeSeparatorLabel: 'out of',
      }}
    />
  ),
};

const CustomPaginationComponentStory = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const localConfig = getMyTeamsDatatableConfig(localPeople);

  const paginationData = usePagination({
    contentPerPage: 10,
    count: totalRecords,
  });

  const { firstContentIndex, lastContentIndex, navigateToFirstPage } = paginationData;

  useEffect(() => {
    setTotalRecords(localPeople.length);
  }, [localPeople.length]);

  useEffect(() => {
    (async () => {
      setIsLocalLoading(true);
      try {
        const localData = await fakeBackend({ itemsPerPage: 30 });
        setLocalPeople(localData.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLocalLoading(false);
      }
    })();
  }, []);

  const handleUpdateFilteredRecordsCount = useCallback((count: number) => {
    setTotalRecords(count);
  }, []);

  return (
    <Datatable
      title={{
        titleLabel: 'Employees (Custom Pagination)',
      }}
      columns={localConfig.teamsColumns}
      records={localConfig.teamsRecords}
      actions={localConfig.teamsActions}
      search={{
        onUpdateFilteredRecordsCount: handleUpdateFilteredRecordsCount,
      }}
      ui={{ actionsColWidth: 40 }}
      pagination={{
        firstContentIndex,
        lastContentIndex,
        resetPagination: () => navigateToFirstPage(),
        paginationComponent: <CustomPagination {...paginationData} />,
      }}
      isLoading={isLocalLoading}
    />
  );
};

export const CustomPaginationComponent: Story = {
  render: () => <CustomPaginationComponentStory />,
};

export const WithoutPagination: Story = {
  render: () => (
    <StandardDatatableComponent
      title={{
        titleLabel: 'Employees (No Pagination)',
      }}
      pagination={{
        enablePagination: false,
      }}
    />
  ),
};
