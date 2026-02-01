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
import { DatatableColumnVisibilityConfigInterface } from '@/components/shared/datatable/Datatable.types';
import { Person } from '@/constants/FakeBackend';
import { DragEvent } from 'react';

/**
 * Type-safe version of the datatable configuration
 * This demonstrates how to use:
 * - ColumnDef<T> for type safety
 * - DatatableRowEvents<T> for row-level interactions
 * - Column visibility functionality with enableHiding columns
 * - Column visibility configuration options
 */
export const getMyTeamsDatatableConfig = (
  teamDetails: Person[]
): {
  teamsColumns: ColumnDef<Person>[];
  teamsRecords: Person[];
  teamsActions: ActionDef<Person>[];
  teamsRowEvents: DatatableRowEvents<Person>;
  columnVisibilityConfig: DatatableColumnVisibilityConfigInterface;
} => {
  const teamsRecords = teamDetails;

  // Example row events configuration
  const teamsRowEvents: DatatableRowEvents<Person> = {
    onDrop: {
      droppable: ({ /*original,*/ getValue }) =>
        getValue('subscription.status').toLowerCase() === 'idle',
      event: (e: DragEvent, { /*original,*/ getValue }) => {
        console.log(`Row dropped! Employee: ${getValue('first_name')} ${getValue('last_name')}`);
        alert(`Dropped employee: ${getValue('first_name')} ${getValue('last_name')}`);
      },
    },
    onDragStart: {
      icon: <EditIcon />,
      draggable: ({ /*original,*/ getValue }) =>
        getValue('subscription.status').toLowerCase() === 'active',
      event: (e: DragEvent, { /*original,*/ getValue }) => {
        console.log(`Row dragged! Employee: ${getValue('first_name')} ${getValue('last_name')}`);
      },
    },
    onClick: {
      // Only enable click for active users
      clickable: ({ /*original,*/ getValue }) =>
        getValue('subscription.status').toLowerCase() === 'active',
      event: (e, { /*original,*/ getValue }) => {
        console.log('Row clicked:', getValue('first_name'), getValue('last_name'));
        alert(
          `Clicked on ${getValue('first_name')} ${getValue('last_name')} (${getValue('employment.title')})`
        );
      },
    },
    onDoubleClick: {
      // Enable double click for all users
      clickable: true,
      event: (e, { /*original,*/ getValue }) => {
        console.log('Row double-clicked:', getValue('first_name'), getValue('last_name'));
        alert(
          `Double-clicked on ${getValue('first_name')} ${getValue('last_name')}\nID: ${getValue('id')}\nStatus: ${getValue('subscription.status')}`
        );
      },
    },
  };

  const teamsColumns: ColumnDef<Person>[] = [
      {
        accessorKey: 'first_name',
        header: 'Name',
        enableSorting: true,
        enableHiding: false, // Always visible - core identifier
        enableOrdering: true, // Enable column ordering for name column
        cell: ({ /*original,*/ getValue }) => (
          <p style={{ margin: 0 }}>
            {getValue('first_name')} {getValue('last_name')}
          </p>
        ),
      },
      {
        accessorKey: 'employment.title',
        header: 'Occupation',
        enableSorting: true,
        enableHiding: true, // Can be hidden via column visibility toggle
        enableOrdering: true, // Enable column ordering for occupation column
      },
      {
        accessorKey: 'subscription.status',
        header: 'Status',
        enableSorting: true, // Enable sorting for status column
        enableHiding: true, // Can be hidden via column visibility toggle
        enableOrdering: false, // Disable column ordering for status column
        // width: '10%',
        cell: ({ /*original,*/ getValue }) => (
          <p
            className={`status ${
              getValue('subscription.status').toLowerCase() === 'active'
                ? 'success'
                : getValue('subscription.status').toLowerCase() === 'blocked'
                  ? 'danger'
                  : 'warn'
            }`}
          >
            {getValue('subscription.status')}
          </p>
        ),
      },
    ],
    teamsActions: ActionDef<Person>[] = [
      {
        icon: <TrashIcon />,
        //it can be boolean => disabled: true
        disabled: ({ /*original,*/ getValue }) =>
          getValue('subscription.status').toLowerCase() === 'active',
        //it can be boolean => hidden: true
        hidden: ({ /*original,*/ getValue }) =>
          getValue('subscription.status').toLowerCase() === 'idle',
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
        onClick: (e, { /*original,*/ getValue }) => {
          console.log('delete ', `${getValue('first_name')} ${getValue('last_name')}`);
        },
      },
      {
        //it can be boolean => hidden: true
        hidden: ({ /*original,*/ getValue }) =>
          getValue('subscription.status').toLowerCase() !== 'idle',
        //keep in mind that if you use the cell function it's your
        //responsibility to set the disabled flag and on click event
        cell: ({ /*original,*/ getValue }) => (
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
                    onClick: () =>
                      console.log(`Edit: ${getValue('first_name')} ${getValue('last_name')}`),
                    data: 'EDIT',
                  },
                },
                {
                  displayValue: 'Delete',
                  leftIcon: <DeleteIcon />,
                  onClickData: {
                    onClick: () =>
                      console.log(`Delete: ${getValue('first_name')} ${getValue('last_name')}`),
                    data: 'DELETE',
                  },
                },
              ],
            }}
          />
        ),
      },
    ];

  // Column visibility configuration example
  const columnVisibilityConfig: DatatableColumnVisibilityConfigInterface = {
    show: true,
    trigger: {
      // label: '',
    },
    // Option 1: Specify which columns should be visible by default
    defaultVisibleColumns: ['employment.title'], // Only Name and Occupation visible by default

    // Option 2: Alternative - specify which columns should be hidden by default
    // hiddenColumns: ['subscription.status'], // Hide Status column by default
  };

  return { teamsColumns, teamsRecords, teamsActions, teamsRowEvents, columnVisibilityConfig };
};
