import { actionsColumnName } from '@/components/shared/datatable/datatableHeader/DatatableHeader';
import { ActionInterface } from '@/components/shared/datatable/Datatable.types';
import { AccessorKeyType } from '@/components/shared/datatable/datatableHeader/DatatableHeader.types';

export const getPaginationRange = (fromPageNum: number, toPageNum: number, step = 1): number[] => {
  let i = fromPageNum;
  const range = [];

  while (i <= toPageNum) {
    range.push(i);
    i += step;
  }

  return range;
};

export const createWrapperAndAppendToBody = (wrapper: string, wrapperElementId: string) => {
  const wrapperElement = document.createElement(wrapper);
  wrapperElement.setAttribute('id', wrapperElementId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replaceAllAlternative = (str: string, search: string, replace: string) =>
  str.replace(new RegExp(escapeRegExp(search), 'g'), replace);

export const transformToDashedString = (text: string) =>
  replaceAllAlternative(text.toLowerCase(), ' ', '-').trim();

const regex = /(auto|scroll)/;

const style = (node: Element, prop: string) => getComputedStyle(node, null).getPropertyValue(prop);

const scroll = (node: Element) =>
  regex.test(style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x'));

// get the first scrollable parent
export const getScrollParent: any = (node: any) =>
  !node || node === document.body
    ? document.body
    : scroll(node)
      ? node
      : getScrollParent(node.parentNode);

// get {top, left} of the required element
export const getElementOffset = (el: any) => {
  let _x = 0,
    _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
};

export function getTableDataCellWidth({
  width,
  actionsColWidth,
  accessorKey,
  columns,
  actions,
}: {
  width?: number | string;
  actionsColWidth?: number | string;
  accessorKey: AccessorKeyType;
  columns: any[];
  actions?: ActionInterface[];
}) {
  const actionsColumnWidth = actions
      ? //32 => button width; 5 => gap between buttons;
        actions.length * 32 + (actions.length > 1 ? (actions.length - 1) * 5 : 0)
      : 0,
    finalActionsColumnsWidth = actionsColWidth
      ? actionsColWidth
      : actionsColumnWidth > 100
        ? actionsColumnWidth
        : 100;

  return width
    ? width
    : accessorKey === actionsColumnName
      ? finalActionsColumnsWidth
      : `calc((100% - ${
          columns.some((el) => el.accessorKey === actionsColumnName)
            ? `${finalActionsColumnsWidth}px`
            : '0'
        }) / ${
          columns.some((el) => el.accessorKey === actionsColumnName)
            ? columns.length - 1
            : columns.length
        })`;
}

//get object nested value from string, (e.g: 'person.name')
export function getNestedValue({ key, obj }: { key: string; obj: any }) {
  return key.split('.').reduce(function (row, prop) {
    return row && row[prop];
  }, obj);
}
