import { OptionInterface } from '@/components/shared/dropdown/Dropdown.types';
import { ReactNode } from 'react';

export interface DropdownOptionInterface {
  option: OptionInterface;
  optionClasses?: string;
  onClick: (option: OptionInterface) => void;
  isCheckboxMultiSelect?: boolean;
  isMultiSelect?: boolean;
  dropdownValue: string | string[];
  resetActiveSuggestion: () => void;
  isMarkSelectedOption?: boolean;
  markSelectedOptionIcon?: ReactNode;
  markSelectedOptionClassName?: string;
}
