import { MouseEvent } from 'react';
import TrashIcon from '@/assets/icons/TrashIcon';
import Dropdown from '@/components/shared/dropdown/Dropdown';
import DotsIcon from '@/assets/icons/DotsIcon';
import EditIcon from '@/assets/icons/EditIcon';
import DeleteIcon from '@/assets/icons/DeleteIcon';

export const getMyTeamsDatatableConfig = (teamDetails: any) => {
  const teamsRecords = teamDetails,
    teamsColumns = [
      {
        accessorKey: 'first_name',
        colName: 'Name',
        sortable: true,
        render: (rowData: any) => (
          <p style={{ margin: 0 }}>
            {rowData.first_name} {rowData.last_name}
          </p>
        ),
      },
      {
        accessorKey: 'employment.title',
        colName: 'Occupation',
        sortable: true,
      },
      {
        accessorKey: 'subscription.status',
        colName: 'Status',
        // width: '10%',
        render: (rowData: any) => (
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
    teamsActions = [
      {
        icon: <TrashIcon />,
        //it can be boolean => disabled: true
        disabled: (rowData: any) => rowData.subscription.status.toLowerCase() === 'active',
        //it can be boolean => hidden: true
        hidden: (rowData: any) => rowData.subscription.status.toLowerCase() === 'idle',
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
        onClick: (e: MouseEvent<HTMLButtonElement>, rowData: any) => {
          console.log('delete ', `${rowData.first_name} ${rowData.last_name}`);
        },
      },
      {
        //it can be boolean => hidden: true
        hidden: (rowData: any) => rowData.subscription.status.toLowerCase() !== 'idle',
        //keep in mind that if you use the render function it's your
        //responsibility to set the disabled flag and on click event
        render: (rowData: any) => (
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
