import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect, useState } from 'react';

import Datatable from '../Datatable';
import { fakeBackend, Person } from '@/constants/FakeBackend';
import { RowInfo } from '@/components/shared/datatable/Datatable.types';
import { getMyTeamsDatatableConfig } from '@/constants/MyTeamsDatatableConfig';

const meta: Meta<typeof Datatable> = {
  title: 'Components/Datatable/Selections',
  component: Datatable,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Datatable>;

// Selection Stories
const RadioSelectionComponent = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>({
    id: 25,
    first_name: 'Benjamin',
    last_name: 'Lee',
    employment: { title: 'Data Analyst' },
    subscription: { status: 'active' },
  });
  const localConfig = getMyTeamsDatatableConfig(localPeople);

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

  return (
    <div>
      <p>Selected person ID: {selectedPerson ? selectedPerson.id : 'None'}</p>
      <Datatable
        title={{
          titleLabel: 'Employees (Radio Selection)',
        }}
        columns={localConfig.teamsColumns}
        records={localConfig.teamsRecords}
        actions={localConfig.teamsActions}
        config={{
          ui: { actionsColWidth: 40 },
          selection: {
            mode: 'radio',
            disabled: ({ original, getValue }: RowInfo<Person>) =>
              getValue('subscription.status').toLowerCase() === 'blocked',
            hidden: ({ original, getValue }: RowInfo<Person>) =>
              getValue('subscription.status').toLowerCase() === 'idle',
            onSelectionChange: (data: Person | Person[]) => {
              setSelectedPerson(data as Person);
            },
            dataKey: 'id',
            selectedData: selectedPerson,
          },
        }}
        isLoading={isLocalLoading}
      />
    </div>
  );
};

export const RadioSelection: Story = {
  render: () => <RadioSelectionComponent />,
};

const CheckboxSelectionComponent = () => {
  const [localPeople, setLocalPeople] = useState<Person[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [selectedPersons, setSelectedPersons] = useState<Person[]>([
    {
      id: 25,
      first_name: 'Benjamin',
      last_name: 'Lee',
      employment: { title: 'Data Analyst' },
      subscription: { status: 'active' },
    },
  ]);
  const localConfig = getMyTeamsDatatableConfig(localPeople);

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

  return (
    <div>
      <p>Selected persons IDs: {selectedPersons.map((el) => el.id).join(', ')}</p>
      <Datatable
        title={{
          titleLabel: 'Employees (Checkbox Selection)',
        }}
        columns={localConfig.teamsColumns}
        records={localConfig.teamsRecords}
        actions={localConfig.teamsActions}
        config={{
          ui: { actionsColWidth: 40 },
          selection: {
            mode: 'checkbox',
            disabled: ({ original, getValue }: RowInfo<Person>) =>
              getValue('subscription.status').toLowerCase() === 'blocked',
            hidden: ({ original, getValue }: RowInfo<Person>) =>
              getValue('subscription.status').toLowerCase() === 'idle',
            onSelectionChange: (selectionsArr: Person | Person[]) => {
              setSelectedPersons(selectionsArr as Person[]);
            },
            dataKey: 'id',
            selectedData: selectedPersons,
          },
        }}
        isLoading={isLocalLoading}
      />
    </div>
  );
};

export const CheckboxSelection: Story = {
  render: () => <CheckboxSelectionComponent />,
};
