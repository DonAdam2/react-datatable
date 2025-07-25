import { DatatableIconButtonInterface } from '@/components/shared/datatable/datatableIconButton/DatatableIconButton.types';
import ConditionalWrapper from '@/components/shared/conditionalWrapper/ConditionalWrapper';
import Tooltip from '@/components/shared/tooltip/Tooltip';

const DatatableIconButton = ({
  disabled,
  hidden,
  icon,
  onClick,
  rowData,
  render,
  tooltip,
}: DatatableIconButtonInterface) => {
  const disabledBtn = disabled
    ? typeof disabled === 'boolean'
      ? disabled
      : disabled(rowData)
    : undefined;

  return (
    <>
      {!(hidden ? (typeof hidden === 'boolean' ? hidden : hidden(rowData)) : undefined) && (
        <ConditionalWrapper
          initialWrapper={(children: any) => <>{children}</>}
          condition={tooltip !== undefined}
          wrapper={(children: any) => (
            <>
              {tooltip !== undefined && (
                <Tooltip {...tooltip} disabled={disabledBtn}>
                  {children}
                </Tooltip>
              )}
            </>
          )}
        >
          {render ? (
            render(rowData)
          ) : (
            <button
              disabled={disabledBtn}
              onClick={(e) => onClick?.(e, rowData)}
              className="datatable-icon-button"
            >
              {icon}
            </button>
          )}
        </ConditionalWrapper>
      )}
    </>
  );
};
export default DatatableIconButton;
