import React, { useState, useRef, useEffect, useCallback } from 'react';
import { arrayToDelimitedString, capitalize, formatFormula, pluralize } from '../utils';
import { FaAngleDown, FaExclamationTriangle, FaQuestionCircle } from 'react-icons/fa';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import {
  Wrapper as MenuWrapper,
  Button as MenuButton,
  Menu,
  MenuItem
} from 'react-aria-menubutton';
import { useDebounce } from '../../../utils/hooks';
import { PeriodicContext } from '../../periodic-table/periodic-table-state/periodic-selection-context';
import { MaterialsInputBox } from './MaterialsInputBox';
import { TableLayout } from '../../periodic-table/periodic-table-component/periodic-table.component';
import { SelectableTable } from '../../periodic-table/table-state';
import './MaterialsInput.css';
import { PeriodicTableModeSwitcher } from '../../periodic-table/PeriodicTableModeSwitcher';
import {
  getAllowedSelectionModes,
  getMaterialsInputTypeByMappedValue,
  materialsInputTypes
} from './utils';
import { Tooltip } from '../../data-display/Tooltip';
import { InputHelpItem } from './InputHelp/InputHelp';

/**
 * Search types supported by this field
 */
export enum MaterialsInputType {
  ELEMENTS = 'elements',
  CHEMICAL_SYSTEM = 'chemical_system',
  FORMULA = 'formula',
  MPID = 'mpid',
  SMILES = 'smiles',
  TEXT = 'text'
}

/**
 * Modes for showing the periodic table
 * TOGGLE: render a button for toggling visibility of periodic table
 * FOCUS: show periodic table when input is focuses, hide on blur
 * NONE: never show the periodic table for this input
 */
export enum PeriodicTableMode {
  TOGGLE = 'toggle',
  FOCUS = 'focus',
  NONE = 'none'
}

/**
 * Props for `MaterialsInput` that get drilled into `MaterialsInputBox`
 */
export interface MaterialsInputSharedProps {
  /**
   * The current/initial value of the input.
   * This value will be dynamically updated so it can be accessed via dash callbacks.
   */
  value?: string;
  /**
   * The current/initial type of the input.
   * The type value changes dynamically based on the input value.
   */
  type?: MaterialsInputType;
  /**
   * List of input types that are allowed to be entered into the input.
   * This determines which types the component will dynamically detect.
   * Each item in the list must be a valid `MaterialsInputType`.
   * e.g. `['elements', 'checmical_system', 'formula']`
   */
  allowedInputTypes?: MaterialsInputType[];
  /**
   * Text to display in the input when there is no value.
   */
  placeholder?: string;
  /**
   * Text to display in the error tooltip when an invalid input value is detected.
   */
  errorMessage?: string;
  /**
   * Class name(s) to apply to the input element in addition to the
   * 'input' class which is added automatically.
   */
  inputClassName?: string;
  /**
   * API URL route to use to send autocomplete requests to when typing in a formula.
   */
  autocompleteFormulaUrl?: string;
  /**
   * API key to send along with the autocomplete request.
   */
  autocompleteApiKey?: string;
  /**
   * List of labels and examples to display under the input when it is focused and there is no value.
   * Each item must be an object with a `label` string and/or `examples` array.
   * Strings in `examples` arrays will be clickable and will fill the input value with the example.
   * e.g.
   * `[
   *  {label: 'Search by formula', examples: ['NaCl', 'MnO2']},
   *  {label: 'See more examples in the documentation'}
   * ]`
   */
  helpItems?: InputHelpItem[];
  /**
   * The maximum number of elements that can be entered or selected in the periodic table.
   */
  maxElementSelectable?: number;
  /**
   * This prop is used internally by `MaterialsInputBox` and will be ignored if set on `MaterialsInput`.
   */
  showAutocomplete?: boolean;
  /**
   * This prop is used internally by `MaterialsInputBox` and will be ignored if set on `MaterialsInput`.
   */
  setShowAutocomplete?: (value: boolean) => any;
  /**
   * Function to run when the value changes.
   */
  onChange?: (value: string) => any;
  /**
   * Function to run when the input type changes.
   */
  onInputTypeChange?: (type: MaterialsInputType) => any;
  /**
   * Function to run when the submit button is clicked.
   */
  onSubmit?: (event: React.FormEvent | React.MouseEvent, value?: string, filterProps?: any) => any;
}

/**
 * Props that are exclusively for `MaterialsInput` (not drilled into `MaterialsInputBox`)
 */
export interface MaterialsInputProps extends MaterialsInputSharedProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * Class name(s) to append to the component's default class (`mpc-materials-input`)
   */
  className?: string;
  /**
   * Number of milliseconds to wait before registering the value change.
   */
  debounce?: number;
  /**
   * Control how or if the periodic table should display with the input.
   * Must be a valid `PeriodicTableMode` ('toggle', 'focus', or 'none').
   */
  periodicTableMode?: PeriodicTableMode;
  /**
   * An alternative way to turn off the periodic table.
   * This could likely be removed in the future.
   */
  hidePeriodicTable?: boolean;
  /**
   * Set to true to display a left-hand dropdown for displaying and changing
   * the input type.
   */
  showTypeDropdown?: boolean;
  /**
   * Set to true to show a submit button on the right-hand side of the input.
   */
  showSubmitButton?: boolean;
  /**
   * This prop can be used by dash callbacks to listen for user clicks on the submit button.
   */
  submitButtonClicks?: number;
  /**
   * Text to display in the submit button.
   */
  submitButtonText?: string;
  /**
   * Text to display in a label box on the left-hand side of the input.
   * If none is supplied, there will not be a label rendered.
   */
  label?: string;
  /**
   * Hide the wildcard asterisk button with the periodic table.
   * Use this for situations where you want to support element or chemical system
   * selections, but you can't support wildcard searches.
   */
  hideWildcardButton?: boolean;
  /**
   * Text to display in the periodic table help box when
   * the chemical system selection mode is selected.
   * Supports markdown.
   */
  chemicalSystemSelectHelpText?: string;
  /**
   * Text to display in the periodic table help box when
   * the elements selection mode is selected.
   * Supports markdown.
   */
  elementsSelectHelpText?: string;
  /**
   * This prop is controlled automatically.
   * It tells you whether the input is in the loading state or not.
   */
  loading?: boolean;
  /**
   * Function to call when the input value changes that will pass the
   * updated props object to the function.
   */
  onPropsChange?: (propsObject: any) => void;
}

/**
 * An input field component for searching by mp-id, elements, chemical system, formula, or plain text.
 * Renders a text input and a periodic table within a PeriodicContext to support
 * two-way binding between the input and periodic table.
 * i.e. when elements are typed into the field, they are selected in the table,
 * and when elements are selected in the table, they are appended to the field's input.
 */
export const MaterialsInput: React.FC<MaterialsInputProps> = ({
  value = '',
  errorMessage = 'Invalid input value',
  type = MaterialsInputType.ELEMENTS,
  allowedInputTypes = [type],
  onChange = (value) => value,
  maxElementSelectable = 20,
  submitButtonText = 'Search',
  ...otherProps
}) => {
  const props = {
    value,
    type,
    errorMessage,
    allowedInputTypes,
    onChange,
    maxElementSelectable,
    submitButtonText,
    ...otherProps
  };
  const [inputValue, setInputValue] = useState(props.value);
  const [inputType, setInputType] = useState(props.type);
  const debouncedInputValue = props.debounce ? useDebounce(inputValue, props.debounce) : inputValue;
  const [inputRef, setInputRef] = useState<React.RefObject<HTMLInputElement>>();
  const [error, setError] = useState<string | null>(null);
  const [errorTipStayActive, setErrorTipStayActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [submitButtonClicks, setSubmitButtonClicks] = useState(0);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const hasPeriodicTable = props.periodicTableMode !== PeriodicTableMode.NONE;
  const [selectionMode, setSelectionMode] = useState(() => {
    return materialsInputTypes[inputType].selectionMode;
  });
  const hasDynamicInputType = props.allowedInputTypes.length > 1;
  const showTypeDropdown = props.showTypeDropdown && hasDynamicInputType;
  let typeDropdownOptions: string[] = [];
  /**
   * Determine if this input only allows elements and chemical system so
   * that a different type dropdown can be used.
   */
  let dropdownOnlyElementsOrChemSys = false;
  const elementTypes = [MaterialsInputType.ELEMENTS, MaterialsInputType.CHEMICAL_SYSTEM];
  if (
    showTypeDropdown &&
    props.allowedInputTypes.length === 2 &&
    props.allowedInputTypes.every((t) => elementTypes.indexOf(t) > -1) &&
    props.allowedInputTypes[0] !== props.allowedInputTypes[1]
  ) {
    dropdownOnlyElementsOrChemSys = true;
    typeDropdownOptions = [
      materialsInputTypes[MaterialsInputType.CHEMICAL_SYSTEM].elementsOnlyDropdownValue,
      materialsInputTypes[MaterialsInputType.ELEMENTS].elementsOnlyDropdownValue
    ];
  } else if (showTypeDropdown) {
    props.allowedInputTypes.forEach((t) => {
      typeDropdownOptions.push(materialsInputTypes[t].dropdownValue);
    });
  }

  const [typeDropdownValue, setTypeDropdownValue] = useState<string | undefined>(() => {
    if (showTypeDropdown && !dropdownOnlyElementsOrChemSys) {
      return materialsInputTypes[inputType].dropdownValue;
    } else if (showTypeDropdown && dropdownOnlyElementsOrChemSys) {
      return materialsInputTypes[inputType].elementsOnlyDropdownValue;
    } else {
      return;
    }
  });
  const periodicTableClicked = useRef(false);
  const [showPeriodicTable, setShowPeriodicTable] = useState(() => {
    return props.periodicTableMode === PeriodicTableMode.TOGGLE && !props.hidePeriodicTable
      ? true
      : false;
  });
  const [isFocused, setIsFocused] = useState(false);

  const getOnFocusProp = () => {
    setErrorTipStayActive(false);
    setIsFocused(true);
    if (props.periodicTableMode === PeriodicTableMode.FOCUS) {
      return setShowPeriodicTable(true);
    } else {
      return;
    }
  };

  /**
   * When blurring out of the input,
   * make sure the user is not clicking on a periodic table element button.
   * If so, keep the input in focus.
   * Otherwise, hide the periodic table (if using show onFocus mode)
   */
  const getOnBlurProp = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const target = e.target;
    setIsFocused(false);
    if (props.periodicTableMode !== PeriodicTableMode.FOCUS) {
      return;
    } else if (!periodicTableClicked.current) {
      setShowPeriodicTable(false);
    } else {
      /** Chrome can make use of relatedTarget to avoid using a timeout */
      if (relatedTarget && relatedTarget.className.indexOf('mat-element') > -1) {
        target.focus();
      } else {
        setTimeout(() => {
          target.focus();
        });
      }
    }
    periodicTableClicked.current = false;
  };

  /**
   * If the user is tabbing out of the input,
   * force periodic table to close.
   * This allows users to tab past MaterialInputs that
   * only show periodic tables on focus.
   * Tha above blur function doesn't work because the relatedTarget on tab would be a mat-element.
   */
  const getOnKeyDownProp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 9 && props.periodicTableMode === PeriodicTableMode.FOCUS) {
      return setShowPeriodicTable(false);
    }
  };

  const getOnInputTypeChangeProp = () => {
    if (hasDynamicInputType) {
      return (value: MaterialsInputType) => setInputType(value);
    } else {
      return;
    }
  };

  /**
   * Trigger MaterialsInput submit event
   */
  const handleSubmit = (e: React.FormEvent | React.MouseEvent, value?: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!error) {
      setShowPeriodicTable(false);
      setShowAutocomplete(false);

      if (props.setProps) {
        setSubmitButtonClicks(submitButtonClicks + 1);
      }

      if (props.onSubmit) {
        /**
         * Optional value param allows function to submit a new value that doesn't necessarily
         * match the current input value (currently used for clicking on autocomplete items).
         * This only works in React. No way right now to pass a clicked autocomplete value
         * directly to a callback.
         */
        const submitValue = value || inputValue;
        props.onSubmit(e, submitValue);
      }
    } else {
      setErrorTipStayActive(true);
    }
  };

  /**
   * Take a new value from either the periodic table mode selector or
   * the input type dropdown, set the new input type, and convert the input value
   * to match the new type (e.g. Fe,Co --> Fe-Co).
   * @param selectedValue value selected from the selector or dropdown
   * @param lookupKey key within `materialsInputTypes` that maps this kind of selection to a MaterialsInputType
   * @param currentInputType the current inputType value
   * @param currentInputValue the current inputValue
   */
  const convertSelectionToInputType = (
    selectedValue: any,
    lookupKey: string,
    currentInputType: MaterialsInputType,
    currentInputValue: string
  ) => {
    const elements: string[] | undefined =
      materialsInputTypes[currentInputType].validate(currentInputValue);
    const wildcards = currentInputValue.match(/\*/g);
    const elementsPlusWildcards = wildcards ? elements?.concat(wildcards) : elements;
    const newSelection = getMaterialsInputTypeByMappedValue(lookupKey, selectedValue);

    if (newSelection) {
      setInputType(newSelection);
    }

    if (newSelection === MaterialsInputType.CHEMICAL_SYSTEM) {
      if (elementsPlusWildcards && elementsPlusWildcards.length > 1) {
        setInputValue(arrayToDelimitedString(elementsPlusWildcards, /-/));
      }
    } else if (newSelection === MaterialsInputType.ELEMENTS) {
      if (elements && elements.length > 1) {
        setInputValue(arrayToDelimitedString(elements, /,/));
      }
    } else if (
      newSelection === MaterialsInputType.FORMULA &&
      currentInputType !== MaterialsInputType.FORMULA
    ) {
      if (elements && elements.length > 1) {
        setInputValue(arrayToDelimitedString(elements, ''));
      }
    }
  };

  /**
   * Set values for props that Dash needs to be dynamically aware of.
   */
  const setDashProps = () => {
    if (props.setProps) {
      props.setProps({
        ...props,
        value: inputValue,
        type: inputType,
        submitButtonClicks: submitButtonClicks
      });
    }
  };

  /**
   * Check whether submit button should be disabled
   */
  const shouldDisable = () => {
    if (props.loading || error || !inputValue) {
      return setDisabled(true);
    } else {
      return setDisabled(false);
    }
  };

  let materialsInputField: JSX.Element | null = null;
  let materialsInputFieldControls: JSX.Element | null = null;
  let labelControl: JSX.Element | null = null;
  let periodicToggleControl: JSX.Element | null = null;
  let periodicTablePlugin: JSX.Element | undefined = undefined;
  let typeDropdown: JSX.Element | null = null;
  const handleSetValue = useCallback((e) => {
    setInputValue(e);
    props.onSubmit && props.onSubmit(null as any, e);
  }, []);
  const materialsInputControl = (
    <MaterialsInputBox
      value={inputValue}
      type={inputType}
      allowedInputTypes={props.allowedInputTypes as MaterialsInputType[]}
      setValue={handleSetValue}
      onInputTypeChange={getOnInputTypeChangeProp()}
      onFocus={getOnFocusProp}
      onBlur={getOnBlurProp}
      onKeyDown={getOnKeyDownProp}
      onSubmit={handleSubmit}
      liftInputRef={(ref) => setInputRef(ref)}
      placeholder={props.placeholder}
      errorMessage={props.errorMessage}
      setError={setError}
      inputClassName={props.inputClassName}
      autocompleteFormulaUrl={props.autocompleteFormulaUrl}
      autocompleteApiKey={props.autocompleteApiKey}
      showAutocomplete={showAutocomplete}
      setShowAutocomplete={setShowAutocomplete}
      onChange={props.onChange}
      helpItems={props.helpItems}
      maxElementSelectable={props.maxElementSelectable}
    />
  );

  if (props.label) {
    labelControl = (
      <div className="control">
        <button className="button is-static">{props.label}</button>
      </div>
    );
  }

  if (props.periodicTableMode === PeriodicTableMode.TOGGLE) {
    var tooltipId = `materials-input-periodic-button-${uuidv4()}`;
    periodicToggleControl = (
      <div className="control">
        <button
          data-testid="materials-input-toggle-button"
          type="button"
          className="button has-oversized-icon is-size-2"
          onClick={() => setShowPeriodicTable(!showPeriodicTable)}
          data-tip
          data-for={tooltipId}
        >
          <i
            className={classNames('icon-fontastic-periodic-table-squares', {
              'is-active': showPeriodicTable
            })}
          />
          <Tooltip id={tooltipId} place="bottom">
            {showPeriodicTable ? 'Hide Periodic Table' : 'Show Periodic Table'}
          </Tooltip>
        </button>
      </div>
    );
  }

  const errorTooltipId = `materials-error-${uuidv4()}`;
  const errorControl = (
    <div className="control">
      <button
        data-testid="materials-input-error"
        type="button"
        className={classNames('mpc-materials-input-error button', {
          'has-tooltip-active': errorTipStayActive
        })}
        onMouseOver={(e) => setErrorTipStayActive(false)}
        data-tip
        data-for={errorTooltipId}
      >
        <FaExclamationTriangle />
        <Tooltip id={errorTooltipId} place="bottom">
          {error}
        </Tooltip>
      </button>
    </div>
  );

  if (showTypeDropdown) {
    typeDropdown = (
      <MenuWrapper
        data-testid="mpc-chemsys-dropdown"
        className="control dropdown is-active"
        onSelection={(v: string) => {
          setTypeDropdownValue(v);
        }}
      >
        <div className="dropdown-trigger">
          <MenuButton className="button">
            <span>{typeDropdownValue}</span>
            <span className="icon">
              <FaAngleDown />
            </span>
          </MenuButton>
        </div>
        <Menu className="dropdown-menu">
          <ul className="dropdown-content">
            {typeDropdownOptions.map((d) => (
              <MenuItem key={d} value={d}>
                <li
                  className={classNames('dropdown-item', {
                    'is-active': d === typeDropdownValue
                  })}
                >
                  {d}
                </li>
              </MenuItem>
            ))}
          </ul>
        </Menu>
      </MenuWrapper>
    );
  }

  materialsInputFieldControls = (
    <>
      {labelControl}
      {typeDropdown}
      {materialsInputControl}
      {error && errorControl}
      {periodicToggleControl}
    </>
  );

  if (props.showSubmitButton) {
    materialsInputField = (
      <form data-testid="materials-input-form" onSubmit={handleSubmit}>
        <div className="field has-addons">
          {materialsInputFieldControls}
          {/* <div className="control">
            <button
              data-testid="materials-input-submit-button"
              className={classNames('button is-primary', {
                'is-loading': props.loading
              })}
              type="submit"
              disabled={disabled}
            >
              {props.submitButtonText}
            </button>
          </div> */}
        </div>
      </form>
    );
  } else {
    materialsInputField = <div className="field has-addons">{materialsInputFieldControls}</div>;
  }

  /**
   * Include periodic table mode switcher if component
   * allows dynamic field switching.
   *
   * Include only formula buttons if component handles the formula field.
   *
   * Include no plugin if component only handles elements field.
   */
  if (hasPeriodicTable) {
    periodicTablePlugin = (
      <PeriodicTableModeSwitcher
        mode={selectionMode}
        allowedModes={getAllowedSelectionModes(props.allowedInputTypes as MaterialsInputType[])}
        hideWildcardButton={props.hideWildcardButton}
        chemicalSystemSelectHelpText={props.chemicalSystemSelectHelpText}
        elementsSelectHelpText={props.elementsSelectHelpText}
        onSwitch={setSelectionMode}
        onFormulaButtonClick={(v) => setInputValue(inputValue + v)}
      />
    );
  }

  /**
   * When the input type changes, dynamically change the periodic table mode and/or
   * type dropdown value so that they stay in sync with the current value's type.
   */
  useEffect(() => {
    setDashProps();
    if (props.onInputTypeChange) props.onInputTypeChange(inputType);

    if (showTypeDropdown && !dropdownOnlyElementsOrChemSys) {
      setTypeDropdownValue(materialsInputTypes[inputType].dropdownValue);
    } else if (showTypeDropdown && dropdownOnlyElementsOrChemSys) {
      setTypeDropdownValue(materialsInputTypes[inputType].elementsOnlyDropdownValue);
    }

    if (
      (hasPeriodicTable && inputType === MaterialsInputType.FORMULA) ||
      inputType === MaterialsInputType.ELEMENTS ||
      inputType === MaterialsInputType.CHEMICAL_SYSTEM
    ) {
      setSelectionMode(materialsInputTypes[inputType].selectionMode);
    }
  }, [inputType]);

  useEffect(() => {
    setDashProps();
    setDisabled(error || !inputValue ? true : false);
  }, [inputValue]);

  useEffect(() => {
    setDashProps();
  }, [submitButtonClicks]);

  /**
   * This effect is triggered when the value prop is changed from outside this component
   * Here inputValue is set, triggering debouncedInputValue to get set after the debounce timer
   */
  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setInputType(props.type);
  }, [props.type]);

  /**
   * This effect is triggered after the debouncedInputValue is set
   * The debouncedInputValue is set with inputValue after the specified debounce time
   * If no debounce prop is supplied, there is no debounce and debouncedInputValue is exactly the same as inputValue
   * Triggers the onChange event prop for the value prop
   *
   * Also handle lifting up the chemsys prop change. Doing these together ensures that the
   * deep compare effect in SearchUIContextProvider isn't triggered twice.
   */
  useEffect(() => {
    if (!error) {
      props.onChange(debouncedInputValue);
      if (props.onPropsChange) props.onPropsChange({ ...props, type: inputType });
    }
  }, [debouncedInputValue]);

  /**
   * When the periodic table selection mode changes...
   * modify the chem sys flag based on the dropdown value,
   * modify the text input type,
   * parse input value into proper syntax (i.e. change or remove element delimiter).
   * Ignore this effect if the input type is not elements or formula (e.g. MPID).
   */
  useEffect(() => {
    if (
      hasPeriodicTable &&
      hasDynamicInputType &&
      (inputType === MaterialsInputType.ELEMENTS ||
        inputType === MaterialsInputType.CHEMICAL_SYSTEM ||
        inputType === MaterialsInputType.FORMULA)
    ) {
      convertSelectionToInputType(selectionMode, 'selectionMode', inputType, inputValue);
    }
  }, [selectionMode]);

  useEffect(() => {
    if (showTypeDropdown) {
      const lookupKey = dropdownOnlyElementsOrChemSys
        ? 'elementsOnlyDropdownValue'
        : 'dropdownValue';
      convertSelectionToInputType(typeDropdownValue, lookupKey, inputType, inputValue);
    }
  }, [typeDropdownValue]);

  /**
   * Set submit button to disabled when there is an error or when loading
   */
  useEffect(() => {
    shouldDisable();
  }, [error, props.loading]);

  /**
   * Set submit button to disabled when there is an error or when loading
   */
  useEffect(() => {
    shouldDisable();
  }, [error, props.loading]);

  return (
    <div id={props.id} className={classNames('mpc-materials-input', props.className)}>
      <PeriodicContext>
        {materialsInputField}
        {props.periodicTableMode !== PeriodicTableMode.NONE && (
          <div
            data-testid="materials-input-periodic-table"
            className={classNames('table-transition-wrapper-small can-hide-by-height', {
              'is-hidden-by-height': !showPeriodicTable,
              'mt-3': showPeriodicTable
            })}
            aria-hidden={!showPeriodicTable}
            onMouseDown={(event) => {
              periodicTableClicked.current = true;
            }}
          >
            <SelectableTable
              className="box"
              disabled={!showPeriodicTable}
              maxElementSelectable={props.maxElementSelectable}
              forceTableLayout={TableLayout.MINI}
              hiddenElements={[]}
              plugin={periodicTablePlugin}
              onStateChange={(enabledElements) => {
                Object.keys(enabledElements).filter((el) => enabledElements[el]);
              }}
            />
          </div>
        )}
      </PeriodicContext>
    </div>
  );
};
