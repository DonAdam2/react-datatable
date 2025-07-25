import TrashIcon from '@/assets/icons/TrashIcon';
import Dropdown from '@/components/shared/dropdown/Dropdown';
import DotsIcon from '@/assets/icons/DotsIcon';
import EditIcon from '@/assets/icons/EditIcon';
import DeleteIcon from '@/assets/icons/DeleteIcon';
import {
  ColumnDef,
  ActionDef,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { Person } from '@/constants/FakeBackend';

/**
 * Type-safe version of the datatable configuration
 * This demonstrates how to use the new ColumnDef<T> for type safety
 */
export const getMyTeamsDatatableConfig = (
  teamDetails: Person[]
): {
  teamsColumns: ColumnDef<Person>[];
  teamsRecords: Person[];
  teamsActions: ActionDef<Person>[];
} => {
  const teamsRecords = teamDetails,
    teamsColumns: ColumnDef<Person>[] = [
      {
        accessorKey: 'first_name',
        header: 'Name',
        sortable: true,
        cell: (rowData) => (
          <p style={{ margin: 0 }}>
            {rowData.first_name} {rowData.last_name}
          </p>
        ),
      },
      {
        accessorKey: 'employment.title',
        header: 'Occupation',
        sortable: true,
      },
      {
        accessorKey: 'subscription.status',
        header: 'Status',
        // width: '10%',
        cell: (rowData) => (
          <p
            className={`status ${
              rowData.subscription.status.toLowerCase() === 'active'
                ? 'success'
                : rowData.subscription.status.toLowerCase() === 'blocked'
                  ? 'danger'
                  : 'warn'
            }`}
          >
            {rowData.subscription.status}
          </p>
        ),
      },
    ],
    teamsActions: ActionDef<Person>[] = [
      {
        icon: <TrashIcon />,
        //it can be boolean => disabled: true
        disabled: (rowData) => rowData.subscription.status.toLowerCase() === 'active',
        //it can be boolean => hidden: true
        hidden: (rowData) => rowData.subscription.status.toLowerCase() === 'idle',
        tooltip: {
          tooltipContent: 'Delete row',
          /*position: TooltipPositionEnum.TOP,
          color: '#ffffff',
          backgroundColor: 'rgba(97, 97, 97, 0.92)',
          trigger: TooltipTriggerEnum.HOVER,
          className: '',
          messageClassName: '',
          isDisplayTooltipIndicator: true,*/
        },
        onClick: (e, rowData) => {
          console.log('delete ', `${rowData.first_name} ${rowData.last_name}`);
        },
      },
      {
        //it can be boolean => hidden: true
        hidden: (rowData) => rowData.subscription.status.toLowerCase() !== 'idle',
        //keep in mind that if you use the cell function it's your
        //responsibility to set the disabled flag and on click event
        cell: (rowData) => (
          <Dropdown
            header={{
              trigger: <DotsIcon />,
            }}
            body={{
              options: [
                {
                  displayValue: 'Edit',
                  leftIcon: <EditIcon />,
                  onClickData: {
                    onClick: () => console.log(`Edit: ${rowData.first_name} ${rowData.last_name}`),
                    data: 'EDIT',
                  },
                },
                {
                  displayValue: 'Delete',
                  leftIcon: <DeleteIcon />,
                  onClickData: {
                    onClick: () =>
                      console.log(`Delete: ${rowData.first_name} ${rowData.last_name}`),
                    data: 'DELETE',
                  },
                },
              ],
            }}
          />
        ),
      },
    ];

  return { teamsColumns, teamsRecords, teamsActions };
};
