import { FC, PropsWithChildren, useRef } from 'react';
import { ClickAwayWrapperInterface } from '@/components/shared/clickAwayWrapper/ClickAwayWrapper.types';
import useClickAway from '@/hooks/useClickAway';

const ClickAwayWrapper: FC<PropsWithChildren<ClickAwayWrapperInterface>> = ({
  onClickAwayCallback,
  className = '',
  children,
}) => {
  const wrapperRef = useRef(null);
  useClickAway(wrapperRef, onClickAwayCallback);

  return (
    <span className={className} ref={wrapperRef}>
      {children}
    </span>
  );
};

export default ClickAwayWrapper;
