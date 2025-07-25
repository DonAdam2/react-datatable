import TrashIcon from '@/assets/icons/TrashIcon';
import Dropdown from '@/components/shared/dropdown/Dropdown';
import DotsIcon from '@/assets/icons/DotsIcon';
import EditIcon from '@/assets/icons/EditIcon';
import DeleteIcon from '@/assets/icons/DeleteIcon';
import {
  ColumnDef,
  ActionDef,
} from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';
import { DatatableRowEvents } from '@/components/shared/datatable/datatableBodyRow/DatatableBodyRow.types';
import { Person } from '@/constants/FakeBackend';

/**
 * Type-safe version of the datatable configuration
 * This demonstrates how to use the new ColumnDef<T> for type safety
 * and the new DatatableRowEvents<T> for row-level interactions
 */
export const getMyTeamsDatatableConfig = (
  teamDetails: Person[]
): {
  teamsColumns: ColumnDef<Person>[];
  teamsRecords: Person[];
  teamsActions: ActionDef<Person>[];
  teamsRowEvents: DatatableRowEvents<Person>;
} => {
  const teamsRecords = teamDetails;

  // Example row events configuration
  const teamsRowEvents: DatatableRowEvents<Person> = {
    onDragStart: {
      draggable: (rowData) => rowData.id === 1,
      event: (e, row) => {
        console.log('Dragging row:', row.first_name, row.last_name);
      },
    },
    onClick: {
      // Only enable click for active users
      clickable: (rowData) => rowData.subscription.status.toLowerCase() === 'active',
      event: (e, row) => {
        console.log('Row clicked:', row.first_name, row.last_name);
        alert(`Clicked on ${row.first_name} ${row.last_name} (${row.employment.title})`);
      },
    },
    onDoubleClick: {
      // Enable double click for all users
      clickable: true,
      event: (e, row) => {
        console.log('Row double-clicked:', row.first_name, row.last_name);
        alert(
          `Double-clicked on ${row.first_name} ${row.last_name}\nID: ${row.id}\nStatus: ${row.subscription.status}`
        );
      },
    },
  };

  const teamsColumns: ColumnDef<Person>[] = [
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

  return { teamsColumns, teamsRecords, teamsActions, teamsRowEvents };
};
