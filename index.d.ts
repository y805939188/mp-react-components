import React$1, { ReactNode, Dispatch, SetStateAction } from 'react';
import * as THREE from 'three';
import { Quaternion, Vector3, Object3D } from 'three';
import PropTypes, { InferProps } from 'prop-types';
import { Place, Effect } from 'react-tooltip';
import { DecodedValueMap, QueryParamConfigMap } from 'use-query-params';

interface MatElement {
  name: string;
  shells: number[];
  category: string;
  category_2?: string;
  symbol: string;
  density: number | null;
  appearance: string | null;
  atomic_mass: number;
  color: string | null;
  boil: number | null;
  number: number | string;
  period: number;
  phase: string;
  hasGroup?: boolean;
  source: string;
  spectral_img: string | null;
  xpos: number;
  ypos: number;
  electron_affinity: number | null;
  ionization_energies: number[];
  discovered_by: string | null;
  molar_heat: number | null;
  melt: number | null;
  electronegativity_pauling: number | null;
  named_by: string | null;
  summary: string;
  electron_configuration: string;
}

declare enum TableLayout {
  SPACED = 'spaced',
  COMPACT = 'compact',
  MINI = 'small',
  MAP = 'map'
}

interface SelectableTableProps {
  className?: string;
  /** array of enabled elements, e.g : ['H', 'O'] */
  enabledElements?: string[];
  /** array of disabled elements, e.g : ['H', 'O'] */
  disabledElements?: string[];
  /** array of hidden elements, e.g : ['H', 'O'] */
  hiddenElements?: string[];
  /** prevent user to select more than N elements */
  maxElementSelectable: number;
  /** callback called with an array of selected elements */
  onStateChange?: (selected: string[]) => void;
  /** whether to force a particular layout */
  forceTableLayout?: TableLayout;
  /** whether to forward non-managed changes */
  forwardOuterChange?: boolean;
  /** component to be plugged into the top spacer */
  plugin?: JSX.Element;
  children?: any;
  /** toggle disabling all table components */
  disabled?: boolean;
}
declare function SelectableTable(props: SelectableTableProps): JSX.Element;

/**
 *
 * Filter is entirely managed by the period context
 *
 * @constructor
 */
declare function TableFilter(): JSX.Element;

declare enum DISPLAY_MODE {
  /** only display number-symbol-name */
  SIMPLE = 'simple',
  /** displays other properties of the element */
  DETAILED = 'detailed'
}
interface PeriodicElementProps {
  /** whether the element is disabled. A disabled element is still visible */
  disabled: boolean;
  /** whether the element is selected. An enabled element is still visible */
  enabled: boolean;
  /** whether the element is hidden. An hidden element is still visible */
  hidden: boolean;
  color?: string;
  /** A periodic element. Can be either the symbol string, or an object implementing MatElement **/
  element: MatElement | string;
  /** what to display  */
  displayMode?: DISPLAY_MODE;
  /** callback called when an element clicked */
  onElementClicked?: (e: MatElement) => void;
  /** callback called when an element is moused over */
  onElementMouseOver?: (e: MatElement) => void;
  /** callback called when mouse leaves an element */
  onElementMouseLeave?: (e: MatElement) => void;
}

interface StandalonePeriodicComponentProps extends PeriodicElementProps {
  /**
   * width and height of the component
   */
  size: number;
}
declare function StandalonePeriodicComponent({
  size,
  ...remainingProps
}: StandalonePeriodicComponentProps): JSX.Element;

declare function PeriodicContext(props: any): JSX.Element;

declare enum ExportType {
  png = 'png',
  dae = 'dae',
  gltf = 'gltf',
  usdz = 'usdz'
}
declare enum AnimationStyle {
  PLAY = 'play',
  SLIDER = 'slider',
  NONE = 'none'
}
declare enum JSON3DObject {
  ELLIPSOIDS = 'ellipsoids',
  CYLINDERS = 'cylinders',
  SPHERES = 'spheres',
  ARROWS = 'arrows',
  CUBES = 'cubes',
  LINES = 'lines',
  SURFACES = 'surface',
  CONVEX = 'convex',
  LABEL = 'labels',
  BEZIER = 'bezier'
}
declare type ThreePosition = [number, number, number];

interface CameraState {
  quaternion?: Quaternion;
  position?: Vector3;
  zoom?: number;
  /**
   * The id of the scene component that most recently set
   * the camera state values.
   * e.g. "1"
   */
  setByComponentId?: string;
  /**
   * whether to follow the camera
   * (what does this mean?)
   */
  following?: boolean;
}

interface CrystalToolkitSceneProps {
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
   * First child will be rendered as the settings panel.
   * Second child will be rendered as the bottom panel (legend).
   */
  children?: ReactNode;
  /**
   * Class name that will wrap around the whole scene component.
   * When enlarged, this class name is applied to the modal-content element.
   */
  className?: string;
  /**
   * Add a debugging view
   */
  debug?: boolean;
  /**
   * Scene JSON, the easiest way to generate this is to use the Scene class
   * in crystal_toolkit.core.scene and its to_json method.
   */
  data: any;
  /**
   * Options used for generating scene.
   * Supported options and their defaults are given as follows:
   * {
   *    antialias: true, // set to false to improve performance
   *    renderer: 'webgl', // 'svg' also an option, used for unit testing
   *    transparentBackground: false, // transparent background
   *    background: '#ffffff', // background color if not transparent,
   *    sphereSegments: 32, // decrease to improve performance
   *    cylinderSegments: 16, // decrease to improve performance
   *    staticScene: true, // disable if animation required
   *    defaultZoom: 1, // 1 will zoom to fit object exactly, <1 will add padding between object and box bounds
   *    zoomToFit2D: false // if true, will zoom to fit object only along the X and Y axes (not Z)
   *    extractAxis: false // will remove the axis from the main scene
   * }
   * There are several additional options used for debugging and testing,
   * please consult the source code directly for these.
   */
  settings?: any;
  /**
   * Hide/show nodes in scene by its name (key), value is 1 to show the node
   * and 0 to hide it.
   */
  toggleVisibility?: any;
  /**
   * File type to be downloaded as an image. Either png or dae
   */
  imageType?: ExportType;
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Data string for the image generated on image button click
   */
  imageData?: string;
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Date string that represents the time imageData was set.
   * Use this prop in dash callbacks to trigger downloads of imageData.
   */
  imageDataTimestamp?: any;
  /**
   * List of options to show in file download dropdown
   */
  fileOptions?: string[];
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * The last file type clicked in the file download menu
   */
  fileType?: string;
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Date string that represents the time fileType was set.
   * Use this prop in dash callbacks to trigger file downloads.
   */
  fileTimestamp?: any;
  onObjectClicked?: (value: any) => any;
  /**
   * Size of axis inlet
   */
  inletSize?: number;
  /**
   * Size of scene
   */
  sceneSize?: number | string;
  /**
   * Padding of axis inlet
   */
  inletPadding?: number;
  /**
   * Orientation of axis view
   */
  axisView?: string;
  /**
   * Animation
   *
   * Set up animation styles
   *
   * 'play'
   * 'none'
   * 'slider'
   */
  animation?: string;
  /**
   * THIS PROP IS SET AUTOMATICALLY
   * Object that maintains the current state of the camera.
   * e.g.
   * {
   *   position: {x: 0, y: 0, z: 0},
   *   quarternion: {x: 0, y: 0, z: 0, w: 0},
   *   zoom: 1,
   *   setByComponentId: "1",
   *   following: true
   * }
   */
  currentCameraState?: CameraState;
  /**
   * Object for setting the scene to a custom camera state.
   * When modified, the camera will update to new custom state.
   * e.g.
   * {
   *   position: {x: 0, y: 0, z: 0},
   *   quarternion: {x: 0, y: 0, z: 0, w: 0}, (optional)
   *   zoom: 1 (optional)
   * }
   */
  customCameraState?: CameraState;
  /**
   * Determines if control bar is visible
   * @default true
   */
  showControls?: boolean;
  /**
   * Determines if expand button in control bar is visible
   * @default true
   */
  showExpandButton?: boolean;
  /**
   * Determines if image download button in control bar is visible
   * @default true
   */
  showImageButton?: boolean;
  /**
   * Determines if file export button in control bar is visible
   * @default true
   */
  showExportButton?: boolean;
  /**
   * Determines if return to original position button in control bar is visible
   * @default true
   */
  showPositionButton?: boolean;
}
/**
 * This component is intended to draw simple 3D scenes using the popular
 * Three.js scene graph library. In particular, the JSON representing the 3D scene
 * is intended to be human-readable, and easily generated via Python. This is not
 * intended to be a replacement for a full scene graph library, but for rapid
 * prototyping by non-experts.
 */
declare const CrystalToolkitScene: React$1.FC<CrystalToolkitSceneProps>;

/**
 *
 * Use CameraContextProvider to coordinate multiple 3D Scene
 *
 */
declare function CameraContextProvider(props: any): JSX.Element;

declare function JsonView(props: InferProps<typeof JsonView.propTypes>): JSX.Element;
declare namespace JsonView {
  var propTypes: {
    type: PropTypes.Requireable<string>;
    src: PropTypes.Requireable<object>;
    name: PropTypes.Requireable<string | boolean>;
    theme: PropTypes.Requireable<string>;
    style: PropTypes.Requireable<object>;
    iconStyle: PropTypes.Requireable<string>;
    indentWidth: PropTypes.Requireable<number>;
    collapsed: PropTypes.Requireable<number | boolean>;
    collapseStringsAfterLength: PropTypes.Requireable<number | boolean>;
    groupArraysAfterLength: PropTypes.Requireable<number>;
    enableClipboard: PropTypes.Requireable<boolean>;
    displayObjectSize: PropTypes.Requireable<boolean>;
    displayDataTypes: PropTypes.Requireable<boolean>;
    defaultValue: PropTypes.Requireable<object>;
    sortKeys: PropTypes.Requireable<boolean>;
    validationMessage: PropTypes.Requireable<string>;
  };
  var defaultProps: {
    src: null;
    name: boolean;
    theme: string;
    style: {};
    iconStyle: string;
    indentWidth: number;
    collapsed: boolean;
    collapseStringsAfterLength: boolean;
    groupArraysAfterLength: number;
    enableClipboard: boolean;
    displayObjectSize: boolean;
    displayDataTypes: boolean;
    defaultValue: null;
    sortKeys: boolean;
    validationMessage: string;
  };
}

/**
 * Render linked data in a force-directed graph.
 * This was an experimental component and is not being used anywhere at the moment.
 */
declare function ReactGraphComponent(
  props: InferProps<typeof ReactGraphComponent.propTypes>
): JSX.Element;
declare namespace ReactGraphComponent {
  var propTypes: {
    /**
     * The ID used to identify this component in Dash callbacks
     */
    id: PropTypes.Requireable<string>;
    /**
     * A graph that will be displayed when this component is rendered
     */
    graph: PropTypes.Requireable<object>;
    /**
     * Display options for the graph
     */
    options: PropTypes.Requireable<object>;
    /**
     * Dash-assigned callback that should be called whenever any of the
     * properties change
     */
    setProps: PropTypes.Requireable<(...args: any[]) => any>;
  };
}

interface SidebarProps {
  width?: number;
  height?: number;
  onAppSelected: (appId: string) => void;
  currentApp: string;
  layout: 'horizontal' | 'vertical';
}
declare const Sidebar: React$1.FC<SidebarProps>;

interface SceneJsonObject {
  name?: string;
  contents?: SceneJsonObject[];
  type?: JSON3DObject;
  clickable?: boolean;
  color?: string;
  radius?: number;
  visible?: boolean;
  origin?: ThreePosition;
  positions?: ThreePosition[];
  headLength?: number;
  headWidth?: number;
  tooltip?: string;
  scale?: ThreePosition[];
  positionPairs?: Array<ThreePosition[]>;
  keyframes?: number[];
  animate?: any[];
  id?: string;
}

declare class Scene {
  private dispatch;
  private debugDOMElement?;
  private settings;
  private renderer;
  private labelRenderer;
  scene: THREE.Scene;
  private cachedMountNodeSize;
  private camera;
  private cameraState?;
  private frameId?;
  private clickableObjects;
  private tooltipObjects;
  private objectDictionnary;
  private controls;
  private tooltipHelper;
  private axis;
  private axisJson;
  private inset;
  private inletPosition;
  private objectBuilder;
  private clickCallback;
  private debugHelper;
  private readonly raycaster;
  private outline;
  private selectedJsonObjects;
  private outlineScene;
  private threeUUIDTojsonObject;
  private computeIdToThree;
  private isMultiSelectionEnabled;
  private registry;
  private clock;
  private animationHelper;
  private cacheMountBBox;
  private determineSceneRenderer;
  private configureSceneRenderer;
  private configureLabelRenderer;
  mouseMoveListener: (e: any) => void;
  clickListener: (e: any) => void;
  private configureScene;
  private configureControls;
  private readonly mouseTrackballUpdate;
  updateCamera(position: Vector3, rotation?: Quaternion, zoom?: number): void;
  private onClickImplementation;
  private addClonedObject;
  updateAnimationStyle(animationStyle: AnimationStyle): void;
  private readonly windowListener;
  constructor(
    sceneJson: any,
    domElement: Element,
    settings: any,
    size: any,
    padding: any,
    clickCallback: any,
    dispatch: (p: Vector3, r: Quaternion, zoom: number) => void,
    debugDOMElement?: any,
    cameraState?: CameraState
  );
  updateInsetSettings(inletSize: number, inletPadding: number, axisView: any): void;
  resizeRendererToDisplaySize(): void;
  addToScene(sceneJson: SceneJsonObject, bypassRendering?: boolean): void;
  private setupCamera;
  makeObject(object_json: any): THREE.Object3D;
  start(): void;
  stop(): void;
  animate(): void;
  renderScene(): void;
  private renderInlet;
  toggleVisibility(namesToVisibility: { [objectName: string]: boolean }): void;
  getClickedReference(
    clientX: number,
    clientY: number,
    objectsToCheck: Object3D[]
  ):
    | {
        point: any;
        object: {
          sceneObject: any;
          jsonObject: any;
        } | null;
      }
    | null
    | undefined;
  getParentObject(object: Object3D): {
    sceneObject: Object3D;
    jsonObject: any;
  } | null;
  enableDebug(debugEnabled: boolean, node: any): void;
  removeListener(): void;
  onDestroy(): void;
  removeObjectByName(name: string): void;
  private getHelper;
  private getInletOrigin;
  private configurePostProcessing;
  findObjectByUUID(uuid: string): {
    threeObject: any;
    jsonObject: any;
  };
  refreshOutline(): void;
  updateTime(time: number): void;
}

interface ScrollspyProps {
  /**
       * An array of MenuGroup items that is used to build the menu and its links.
       * Each MenuGroup has an optional label and a required 'items' array of MenuItems.
       * Each MenuItem has a label that is rendered in the menu and a targetId that is the id of the element it should link to.
       * Do not include '#' in targetId.
       * example:
            [
                  {label: '...', items: [
                      {label: '...', targetId: '...'},
                      {label: '...', targetId: '...', items: [
                          {label: '...', targetId: '...'}
                      }]
                  ]}
              ]
       */
  menuGroups: MenuGroup[];
  /**
   * Class name applied to active links in the menu (default: 'is-active')
   */
  activeClassName: string;
  /**
   * Class name applied to the <aside> that contains the whole menu (default: 'menu')
   */
  menuClassName?: string;
  /**
   * Class name applied to all menu group labels (default: 'menu-label')
   */
  menuGroupLabelClassName?: string;
  /**
   * Class name applied to each <ul> of menu items (default: 'menu-list')
   */
  menuItemContainerClassName?: string;
  /**
   * Class name applied to the `<li>` of each menu item (default: '')
   */
  menuItemClassName?: string;
  /**
   * An integer to determine the scroll offset from an item that will trigger it active (default: -20)
   */
  offset?: number;
}
interface MenuGroup {
  label?: string;
  items: MenuItem[];
}
interface MenuItem {
  label: string;
  targetId: string;
  items?: MenuItem[];
}
/**
 * Component for building in-page navigation menus with scrollspy functionality
 */
declare const Scrollspy: React$1.FC<ScrollspyProps>;

interface InputHelpItem {
  label?: string | null;
  examples?: string[] | null;
}

/**
 * Search types supported by this field
 */
declare enum MaterialsInputType {
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
declare enum PeriodicTableMode {
  TOGGLE = 'toggle',
  FOCUS = 'focus',
  NONE = 'none'
}
/**
 * Props for `MaterialsInput` that get drilled into `MaterialsInputBox`
 */
interface MaterialsInputSharedProps {
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
  onSubmit?: (
    event: React$1.FormEvent | React$1.MouseEvent,
    value?: string,
    filterProps?: any
  ) => any;
}
/**
 * Props that are exclusively for `MaterialsInput` (not drilled into `MaterialsInputBox`)
 */
interface MaterialsInputProps extends MaterialsInputSharedProps {
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
declare const MaterialsInput: React$1.FC<MaterialsInputProps>;

/**
 * A specific version of the MaterialsInput component used within the SearchUI component
 * for performing top level searches by mp-id, formula, or elements.
 * The input value is parsed into its appropriate search inputType upon submission.
 */
interface Props$8 {
  redirectRoute: string;
  hidePeriodicTable?: boolean;
  autocompleteFormulaUrl?: string;
  apiKey?: string;
  placeholder?: string;
}
declare const GlobalSearchBar: React$1.FC<Props$8>;

interface NavbarItem {
  className?: string;
  label?: string;
  href?: string;
  target?: string;
  icon?: string;
  image?: string;
  isDivider?: boolean;
  isMenuLabel?: boolean;
  items?: NavbarItem[];
  isArrowless?: boolean;
  isRight?: boolean;
  isActiveOnClick?: boolean;
}
interface NavbarProps {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  items: NavbarItem[];
  brandItem: NavbarItem;
}
declare const Navbar: React$1.FC<NavbarProps>;

interface Props$7 {
  className?: string;
  items: NavbarItem[];
  isArrowless?: boolean;
  isRight?: boolean;
  isActiveOnClick?: boolean;
}
declare const NavbarDropdown: React$1.FC<Props$7>;

interface SelectOption {
  label: string;
  value: any;
}
interface SelectProps {
  [id: string]: any;
  onChange?: (value: any) => any;
  /**
   * Allow an object of arbitrary props to also
   * be added to the react-select component.
   *
   * This is workaround to let the Dash component
   * version of this component accept extra props
   * supported by react-select without the need to explicitly
   * define those props in the component's propTypes.
   */
  arbitraryProps?: object;
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * The current or initial selected value.
   * This can be the raw value or a full option object.
   */
  value?: any;
  /**
   * List of options to display in the dropdown.
   * Each option should be an object with a `label` and a `value`.
   */
  options: SelectOption[];
}
/**
 * Wrapper component for react-select.
 * Automatically adds the wrapper class "react-select-container"
 * and the class prefix "react-select-" to all the elements created by react-select.
 */
declare const Select: React$1.FC<SelectProps>;

/**
 * The Download component opens a download dialog when the data property (dict of filename, content, and type) changes.
 */
interface DataInput {
  filename: string;
  content: any;
  isBase64?: boolean;
  isDataURL?: boolean;
  mimeType?: string;
}
interface Props$6 {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id: string;
  /**
   * When set, a download is invoked using a Blob.
   */
  data?: DataInput;
  /**
   * Set to true if data.content is a base64 string
   */
  isBase64?: boolean;
  /**
   * Set to true if data.content is a data url
   */
  isDataURL?: boolean;
  /**
   * Default value for mimeType.
   */
  mimeType?: string;
  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps?: (value: any) => any;
}
declare const Download: React$1.FC<Props$6>;

interface BibFilterProps {
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
   * Class name(s) to append to the component's default class (mpc-bib-filter)
   */
  className?: string;
  /**
   * List of objects in bibjson or crossref format.
   * Only the following bib properties are used by this component:
   * title, author (as a list or string), year, doi, and journal.
   * If any of those properties are missing, that property will be omitted from the result card.
   * Any extra properties are simply ignored.
   */
  bibEntries: any[];
  /**
   * Format of the bibliographoc objects supplied in `bibEntries`
   * @default 'bibjson'
   */
  format?: 'crossref' | 'bibjson';
  /**
   * Name of property to initially sort entries by
   * @default 'year'
   */
  sortField?: string;
  /**
   * Set to true to have the initial sorting direction be ascending
   * @default false
   */
  ascending?: boolean;
  /**
   * Class name(s) to append to individual result cards' default class (mpc-bib-card)
   */
  resultClassName?: string;
  /**
   * Set to true to prevent dynamically fetching a link to a free PDF of
   * each reference (using the "doi" field for individual bib entry).
   * NOTE: the open access URL can also be included in a bib entry
   * in the "openAccessUrl" property. If set, the URL will not be fetched.
   * @default false
   */
  preventOpenAccessFetch?: boolean;
}
/**
 * Component for rendering and filtering a list of citations in bibjson or crossref format.
 * Expects bibjson in the format output by the bibtexparser library (https://bibtexparser.readthedocs.io/en/v1.1.0/tutorial.html#).
 * Expects crossref in the format returned by the Crossref API.
 */
declare const BibFilter: React$1.FC<BibFilterProps>;

interface BibjsonCardProps {
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
   * Class name(s) to append to the component's default class
   */
  className?: string;
  /**
   * A single bib object in bibjson format.
   * Only the following bib properties are used by this component: title, author (as a list or string), year, doi, journal.
   * If any of those properties are missing, that property will be omitted from the bibjson result card.
   * Any extra properties are simply ignored.
   */
  bibjsonEntry: any;
  /**
   * Set to true to prevent dynamically fetching a link to a free PDF of
   * the reference (using the doi field).
   * NOTE: the open access URL can also be included in the bibjsonEntry
   * in the `openAccessUrl` property. If set, the URL will not be fetched.
   */
  preventOpenAccessFetch?: boolean;
}
/**
 * Parses a bibjson object and renders a `BibCard`.
 */
declare const BibjsonCard: React$1.FC<BibjsonCardProps>;

declare enum DownloadType {
  JSON = 'json',
  CSV = 'csv'
}

interface Props$5 {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: any;
  filename?: string;
  filetype?: DownloadType;
  tooltip?: string;
}
declare const DownloadButton: React$1.FC<Props$5>;

interface Props$4 {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  buttonClassName?: string;
  data: any;
  filename?: string;
  tooltip?: string;
}
declare const DownloadDropdown: React$1.FC<Props$4>;

interface CrossrefAuthor {
  given: string;
  family: string;
  sequence?: 'first' | 'additional';
  [id: string]: any;
}

interface BibCardProps {
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
   * Class name(s) to append to the component's default class (`mpc-bib-card`)
   */
  className?: string;
  /**
   * Title of the publication
   */
  title?: string;
  /**
   * List of author names for the publication. Can be either a list of plain strings or a list of `CrossrefAuthor` objects.
   * The latter is an object with `given` (name), `family` (last name), and `sequence` ("first" or "additional").
   */
  author?: string[] | CrossrefAuthor[];
  /**
   * Shortened title of the article
   */
  shortName?: string;
  /**
   * Year the article was published
   */
  year?: string | number;
  /**
   * Journal that the article was published in
   */
  journal?: string;
  /**
   * Digital Object Identifier (DOI) for the article. This is used to generate the link to the article.
   * It is also used to fetch an open access link.
   */
  doi?: string;
  /**
   * Set to true to prevent the card from trying to get an open access URL from the Open Access API.
   */
  preventOpenAccessFetch?: boolean;
  /**
   * URL to an openly available version of the article (can also be fetched dynamically if a DOI is supplied).
   */
  openAccessUrl?: string;
}
/**
 * Card for displaying bibliographic information.
 * This component is the basis for the `BibjsonCard` and `CrossrefCard` components.
 */
declare const BibCard: React$1.FC<BibCardProps>;

interface BibtexButtonProps extends React$1.HTMLProps<HTMLAnchorElement> {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Class name(s) to append to the component's default class (mpc-open-access-button)
   * @default 'button is-small'
   */
  className?: string;
  /**
   * The DOI (Digital Object Identifier) of the reference
   * to pass to doi2bib.org.
   */
  doi?: string;
  /**
   * Directly supply the URL to a reference's bibtex.
   * If supplied, the component will not generate its own link using the doi prop.
   */
  url?: string;
  /**
   * Value to add to the anchor tag's target attribute
   * @default '_blank'
   */
  target?: string;
}
/**
 * Standardized button for linking to BibTeX.
 * If no `url` prop is supplied, a link will be generated
 * using the `doi` prop and doi2bib.org.
 */
declare const BibtexButton: React$1.FC<BibtexButtonProps>;

interface CrossrefCardProps {
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
   * Class name(s) to append to the component's default class
   */
  className?: string;
  /**
   * A single bib object in crossref format.
   * If a crossEntry is supplied, a request will not be made to the crossref API.
   * The following bib values are parsed from a Crossref API response: title, authors, year, doi, journal.
   */
  crossrefEntry?: any;
  /**
   * Either a DOI or bibtex string to use to search against the Crossref `/works` endpoint.
   * An identifier must be supplied if you are not supplying the crossrefEntry directly.
   */
  identifier?: string;
  /**
   * Error message to show inside the card if the crossref request fails
   * @default 'Could not find reference'
   */
  errorMessage?: string;
  /**
   * Set to true to prevent dynamically fetching a link to a free PDF of
   * the reference (using the doi field).
   * NOTE: the open access URL can also be included in the crossrefEntry json
   * in the "openAccessUrl" property. If set, the URL will not be fetched.
   */
  preventOpenAccessFetch?: boolean;
}
/**
 * Parses a crossref entry or fetches a reference from the crossref API and renders a `BibCard`.
 */
declare const CrossrefCard: React$1.FC<CrossrefCardProps>;

interface PublicationButtonProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Class name(s) to append to the component's default class (mpc-publication-button)
   * @default 'tag'
   */
  className?: string;
  /**
   * The DOI (Digital Object Identifier) of the publication
   * Will be used to generate a doi.org link and to fetch the journal name and year.
   */
  doi?: string;
  /**
   * Directly supply the URL to the publication.
   * If a doi.org url is supplied, this component will automatically
   * parse the url for the doi and use that to fetch the journal name and year.
   */
  url?: string;
  /**
   * Value to add to the anchor tag's target attribute
   * @default '_blank'
   */
  target?: string;
  /**
   * Only display the publication icon and hide the link label.
   * If true, `showTooltip` will default to true.
   */
  compact?: boolean;
  /**
   * Show a tooltip on hover with the bibliographic citation for the publication.
   */
  showTooltip?: boolean;
}
/**
 * Standardized button for linking to a publication.
 *
 * This component can be used in four ways:
 * 1. Supply just a `doi` and let the component build the url and fetch the journal name and year from crossref.
 * 2. Supply just a `url` to doi.org and fetch the journal name and year from crossref.
 * 3. Supply a `doi` and a link label in the component's `children`. In this case, there will be no fetch to crossref.
 * 4. Supply a `url` to any location and a link label in the component's `children`. In this case, there will be no fetch to crossref.
 */
declare const PublicationButton: React$1.FC<PublicationButtonProps>;

interface TooltipProps {
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
   * The content to display inside the tooltip
   */
  children?: ReactNode;
  /**
   * Position of the tooltip. Defaults to `"top"`.
   * Place will change dynamically tooltip won't fit on screen.
   */
  place?: Place;
  /**
   * Set whether tooltip should float with mouse or stay in a solid position.
   */
  effect?: Effect;
  /**
   * Custom event to trigger tooltip
   */
  event?: string;
  /**
   * Custom event to hide tooltip (only makes effect after setting event attribute)
   */
  eventOff?: string;
  /**
   * Global event to hide tooltip (global only)
   */
  globalEventOff?: string;
  /**
   * Object with `left`, `right`, `top`, and `bottom` keys to set tooltip offsets
   */
  offset?: object;
  /**
   * Whether tooltip should render with multiple lines or not
   */
  multiline?: boolean;
  /**
   * Class name(s) to append to the component's default class (`mpc-data-block`)
   */
  className?: string;
  /**
   * Allow html inside the tooltip content
   */
  html?: boolean;
  /**
   * How long to delay the disappearance of the tooltip after leaving the trigger element
   */
  delayHide?: number;
  /**
   * How long to delay the appearance of the tooltip after hovering the trigger element
   */
  delayShow?: number;
  /**
   * Add one pixel white border
   */
  border?: boolean;
  /**
   * Disable the tooltip behaviour, default is false
   */
  disable?: boolean;
  /**
   * Hide the tooltip when scrolling, default is true
   */
  scrollHide?: boolean;
  /**
   * Enables tooltip to respond to mouse (or touch) events, default is false
   */
  clickable?: boolean;
}
/**
 * Create a tooltip that will display when hovering another element.
 * A `Tooltip` must be used in conjunction with another element that acts as the trigger.
 * The trigger element must have the `data-tip` attribute and set `data-for` to the `id` of the `Tooltip`.
 * See react-tooltip library documentation for more. https://github.com/wwayne/react-tooltip
 */
declare const Tooltip: React$1.FC<TooltipProps>;

/**
 * See storybook for documentation
 */
declare enum FilterType {
  SLIDER = 'SLIDER',
  MATERIALS_INPUT = 'MATERIALS_INPUT',
  TEXT_INPUT = 'TEXT_INPUT',
  SELECT = 'SELECT',
  THREE_STATE_BOOLEAN_SELECT = 'THREE_STATE_BOOLEAN_SELECT',
  SELECT_SPACEGROUP_SYMBOL = 'SELECT_SPACEGROUP_SYMBOL',
  SELECT_SPACEGROUP_NUMBER = 'SELECT_SPACEGROUP_NUMBER',
  SELECT_CRYSTAL_SYSTEM = 'SELECT_CRYSTAL_SYSTEM',
  SELECT_POINTGROUP = 'SELECT_POINTGROUP',
  CHECKBOX_LIST = 'CHECKBOX_LIST'
}
interface Filter {
  /**
   * Name of the filter that will be rendered above its input component
   */
  name: string;
  /**
   * The type of filter component to use. Must be one of the pre-determined filter type strings
   * which maps to a component. See `FilterType` documentation for more information.
   */
  type: FilterType;
  /**
   * List of exact parameter names that this filter should add/modify in the API query.
   * Most filter types only update one query parameter and should only have one param here.
   * Sliders, however, can update both a min and max parameter. For sliders, both the min and
   * max parameters should be included here: `['volume_min', 'volume_max']`
   */
  params: string[];
  /**
   * Whether this filter is active or not. This is handled by the `SearchUI` dynamically so
   * should generally not be used in configuration.
   */
  active?: boolean;
  /**
   * Number by which to multiply the filter value by before it is added to the API query.
   */
  conversionFactor?: number;
  /**
   * Units used in this filter. Can be a unicode string.
   */
  units?: string;
  /**
   * An object of filter options that is dependent on the filter type used.
   * See `FilterType` documentation for more information about which props can be used
   * for specific filter types.
   */
  props?: any;
  /**
   * Tooltip to display when hovering over the filter name
   */
  tooltip?: string;
  /**
   * List of query parameters that this filter should override (turn off) when activated.
   * Parameters listed here must exist in the filterGroups json.
   */
  overrides?: string[];
  /**
   * Set to true if this filter's field is also controlled by the top search bar.
   * i.e. If this filter's field exists in the search bar's `allowedInputTypesMap`.
   * This is used to ensure that the search bar value changes if this filter's value
   * is changed from within the filter.
   */
  isSearchBarField?: boolean;
  /**
   * Set to true to force filter input values to be lowercased before added to the query.
   * This should be used in situations where the filter input make contain an uppercase letter,
   * but the values on the backend are all lowercase.
   */
  makeLowerCase?: boolean;
  /**
   * Hide filter from view
   */
  hidden?: boolean;
}
interface FilterGroup {
  /**
   * Name of the group that will be rendered in the panel
   */
  name: string;
  /**
   * If true, the filter group will be expanded on load
   */
  expanded?: boolean;
  /**
   * If true, the filter group will not be collapsible
   */
  alwaysExpanded?: boolean;
  /**
   * List of filters to render inside of the filter group
   */
  filters: Filter[];
}
interface SearchParam {
  field: string;
  value: any;
}
interface SearchParams {
  [id: string]: any;
}
interface ActiveFilter {
  name: string;
  value: any;
  params: string[];
  defaultValue?: any;
  isSearchBarField?: boolean;
  conversionFactor?: number;
  searchParams?: SearchParam[];
}
declare type FilterValues = Partial<Record<string, any>>;
/**
 * See storybook for documentation
 */
declare enum ColumnFormat {
  FIXED_DECIMAL = 'FIXED_DECIMAL',
  SIGNIFICANT_FIGURES = 'SIGNIFICANT_FIGURES',
  FORMULA = 'FORMULA',
  LINK = 'LINK',
  BOOLEAN = 'BOOLEAN',
  BOOLEAN_CLASS = 'BOOLEAN_CLASS',
  SPACEGROUP_SYMBOL = 'SPACEGROUP_SYMBOL',
  POINTGROUP = 'POINTGROUP',
  ARRAY = 'ARRAY',
  RADIO = 'RADIO',
  EMAIL = 'EMAIL',
  TAG = 'TAG'
}
/**
 * Options for columns that are passed through `initColumns()`.
 */
interface Column {
  /**
   * Human readable title to display with the column
   */
  title: string | number;
  /**
   * Name of the property that this column should pull its value from
   */
  selector: string;
  /**
   * A specified format type that will run the values in this column
   * through the corresponding format function.
   */
  formatType?: ColumnFormat;
  /**
   * Object of extra options that are used in conjunction with the formatType.
   * The properties that you can supply to formatOptions are specific to each
   * formatType. See `ColumnFormat` documentation for more information.
   */
  formatOptions?: any;
  /**
   * Units string to display underneath the column title.
   */
  units?: string;
  /**
   * Number by which to multiply all values in the column by.
   */
  conversionFactor?: number;
  /**
   * If true, the minimum displayable value will be determined by the number of decimals
   * set in `formatOptions`. For example, if `decimals` is `2` then the minimum displayable
   * value will be `0.01` and all values less than that will display as `< 0.01`.
   */
  abbreviateNearZero?: boolean;
  /**
   * If true, column is hidden from table and column selector but is included in data
   */
  hidden?: boolean;
  /**
   * If true, column is hidden from table but is selectable from the column selector
   */
  omit?: boolean;
  /**
   * Column is visible in top section of `DataBlock` and hidden from bottom (`DataBlock` only)
   */
  isTop?: boolean;
  /**
   * Column is visible in bottom section of `DataBlock` and hidden from top (`DataBlock` only)
   */
  isBottom?: boolean;
  /**
   * Fixed width for the column with units e.g. `"100px"`
   */
  width?: string;
  /**
   * Minimum width for the column with units e.g. `"100px"`
   */
  minWidth?: string;
  /**
   * Maximum width for the column with units e.g. `"100px"`
   */
  maxWidth?: string;
  /**
   * Tooltip string to show on column title hover
   */
  tooltip?: string;
  /**
   * Right align the column
   */
  right?: boolean;
  /**
   * Center align the column
   */
  center?: boolean;
  /**
   * Set whether you can sort by column. Defaults to `true`.
   */
  sortable?: boolean;
  /**
   * Allows you to customize the css of the cell using css-in-js style objects
   */
  style?: any;
  [id: string]: any;
}
/**
 * Object to specifiy conditional row styles for a DataTable or SearchUI component
 */
interface ConditionalRowStyle {
  /**
   * Name of the data property to use for the condition
   */
  selector: string;
  /**
   * Value that meets the condition
   */
  value: any;
  /**
   * object of styles supplied in "CSS-in-JS" format
   */
  condition: string;
  /**
   * condition to satisfy for the value provided above, options: "lt", "gt", "eq"
   */
  style: any;
  /**
   * Condition function to determine if row should have the specified styles.
   * NOT USED for `SearchUI` component.
   * The `SearchUI` component will style the row if the row's selector field equals the specified value.
   */
  when?: (row: any) => any;
}
interface SearchUIContainerProps {
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
   * Class name(s) to add to in addition to the default top-level class
   */
  className?: string;
  /**
   * An array of column definition objects to control what is rendered in the results table.
   * See `Column` documentation for specifics on how to construct `Column` objects.
   */
  columns: Column[];
  /**
   * An array of filter groups and their respective array of filters.
   * A filter group is a collapsible section of the filters panel that contains one or more filters.
   * A filter is a type of input element that filters the data based on its value.
   * See `FilterGroup` documentation for specifics on how to construct `FilterGroup` and `Filter` objects.
   */
  filterGroups: FilterGroup[];
  /**
   * The URL endpoint to the API that this component should query
   */
  apiEndpoint: string;
  /**
   * Object of query params that will be automatically added for every search.
   * This can be used to scope down a SearchUI to a specific subset of a larger endpoint.
   *
   * e.g. `{ project: 'open_catalyst_project' }`
   */
  apiEndpointParams?: SearchParams;
  /**
   * The URL endpoint for fetching autocompletion results
   */
  autocompleteFormulaUrl?: string;
  /**
   * API key (if needed) that will be used when making queries
   */
  apiKey?: string;
  /**
   * A noun in singular form to describe what a result represents (e.g. "material").
   * Note that only some special plural mappings are handled automatically (e.g. "battery" --> "batteries").
   * In all other cases, an "s" is appended to `resultLabel`.
   */
  resultLabel?: string;
  /**
   * Optionally include/exclude the menu for dynamically controlling sort options
   * @default true
   */
  hasSortMenu?: boolean;
  /**
   * Optionally include up to 2 fields to sort by on initial load.
   * To sort in descending order, prefix the field name with "-".
   * The first sort field can be modified within the UI. The second will be the default secondary sort field.
   * e.g. `["-energy_above_hull", "formula_pretty"]`
   * If you want to include a default secondary sort field but no default primary sort,
   * then the first item in the array should be null or undefined.
   * e.g. `[null, "formula_pretty"]`
   */
  sortFields?: (string | undefined | null)[];
  /**
   * Name of the sort parameter in the linked API.
   * @default 'sort_fields'
   */
  sortKey?: string;
  /**
   * Name of the skip parameter in the linked API.
   * @default 'skip'
   */
  skipKey?: string;
  /**
   * Name of the limit parameter in the linked API.
   * @default 'limit'
   */
  limitKey?: string;
  /**
   * Name of the fields parameter in the linked API.
   * @default 'fields'
   */
  fieldsKey?: string;
  /**
   * Name of the key in the results that contains the total number of results in the query.
   * Supports nested keys.
   * @default 'meta.total_doc'
   */
  totalKey?: string;
  /**
   * List of conditions for styling rows based on a property (selector) and a value.
   * Note that this prop currently only supports checking for
   * value equivalence (i.e. row[selector] === value).
   * See `ConditionalRowStyle` documentation for how to construct `ConditionalRowStyle` conditions.
   */
  conditionalRowStyles?: ConditionalRowStyle[];
  /**
   * Optionally include/exclude checkboxes next to rows for selecting
   */
  selectableRows?: boolean;
  /**
   * Property to maintain the state of selected rows so that
   * they are accessible via Dash callback
   */
  selectedRows?: any[];
  /**
   * Set the initial results view to one of the preset
   * SearchUI views: 'table', or 'synthesis'.
   * Note that these options may expand in the future.
   */
  view?: SearchUIViewType;
  /**
   * Amount of time in milliseconds that should elapse between a user entering
   * a value in the filters panel and a new query being triggered.
   */
  debounce?: number;
  /**
   * This is a temporary solution to allow SearchUI's to render in Storybook.
   * There is an issue with the dynamic column header components that causes
   * Storybook to crash. Rendering column headers as plain strings fixes the problem.
   * Note that this will disable column tooltips and unit labels.
   */
  disableRichColumnHeaders?: boolean;
  /**
   * This prop is set automatically.
   * Array of results currently rendered in the UI.
   */
  results?: any[];
  /**
   * Endpoint to use for fallback free text material searches against the Matscholar API.
   */
  matscholarEndpoint?: string;
  /**
   * EXPERIMENTAL
   */
  cardOptions?: any;
}
interface SearchState extends SearchUIContainerProps {
  /**
   * Optional props from SearchUIContainerProps that are required by SearchState
   */
  setProps: (value: any) => any;
  sortFields: (string | undefined | null)[];
  sortKey: string;
  skipKey: string;
  limitKey: string;
  fieldsKey: string;
  totalKey: string;
  /**
   * Additional props for SearchState
   */
  defaultLimit?: number;
  defaultSkip?: number;
  totalResults?: number;
  activeFilters?: ActiveFilter[];
  loading?: boolean;
  error?: boolean;
  searchBarValue?: string;
  resultsRef?: React.RefObject<HTMLDivElement> | null;
}
interface SearchContextValue {
  state: SearchState;
  query: DecodedValueMap<QueryParamConfigMap>;
}
/**
 * To add a new view type, head to SearchUI/types and add the name of the type to the
 * SearchUIViewType enum, then add a property in searchUIViewsMap using the same name
 * you used for the type, then provide your custom view component as the value.
 * The view component should consume the SearchUIContext state using the useSearchUIContext hook.
 * See SearchUIDataTable or SearchUIDataCards for example view components.
 */
declare enum SearchUIViewType {
  TABLE = 'table',
  SYNTHESIS = 'synthesis'
}
declare type SearchUIViewTypeMap = Partial<Record<SearchUIViewType, any>>;
declare const searchUIViewsMap: SearchUIViewTypeMap;

interface DataBlockProps {
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
   * Class name(s) to append to the component's default class (`mpc-data-block`)
   */
  className?: string;
  /**
   * Object to render inside the data block.
   * A key value must be a string, number, or array of strings/numbers.
   * Key values cannot be objects.
   */
  data: object;
  /**
   * An array of column definition objects to control how keys/values are rendered in the data block.
   * See `Column` documentation for specifics on how to construct `Column` objects.
   * If no column definitions are supplied, the key names are used as labels and the values are rendered
   * without any formatting.
   */
  columns?: Column[];
  /**
   * Set to true to have bottom columns section expanded on load.
   */
  expanded?: boolean;
  /**
   * Content to display at the bottom-most section of the block.
   */
  footer?: ReactNode;
  /**
   * Class name of an icon to display in the top right of the block.
   */
  iconClassName?: string;
  /**
   * Tooltip text to display when hovering over the icon.
   */
  iconTooltip?: string;
  /**
   * This is a temporary solution to allow SearchUI's to render in Storybook.
   * There is an issue with the dynamic column header components that causes
   * Storybook to crash. Rendering column headers as plain strings fixes the problem.
   * Note that this will disable column tooltips and unit labels.
   */
  disableRichColumnHeaders?: boolean;
}
/**
 * Component for displaying a single row (object) of data in a card-like block.
 * Blocks have a top section that displays data horizontally and an optional collapsible bottom
 * section that displays data vertically.
 */
declare const DataBlock: React$1.FC<DataBlockProps>;

interface FormulaProps {
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
   * Class name(s) to append to the component's default class (`mpc-formula`)
   */
  className?: string;
  /**
   * Formula string to format
   */
  children: string;
}
/**
 * Render a formula string with proper subscripts
 */
declare const Formula: React$1.FC<FormulaProps>;

interface Props$3 {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: any;
}
declare const SynthesisRecipeCard: React$1.FC<Props$3>;

interface MarkdownProps {
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id?: string;
  /**
   * Class name of the container element
   */
  className?: string;
  /**
   * Remove matching leading whitespace from all lines.
   * Lines that are empty, or contain *only* whitespace, are ignored.
   * Both spaces and tab characters are removed, but only if they match;
   * we will not convert tabs to spaces or vice versa.
   */
  dedent?: boolean;
  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state?: any;
  /**
   * User-defined inline styles for the rendered Markdown
   */
  style?: any;
}
/**
 * A custom re-worked version of dcc.Markdown.
 * Uses v6 of react-markdown and applies four plugins
 * to the markdown component by default:
 * - remark-slug
 * - remark-highlight.js
 * - remark-math
 * - rehype-katex
 */
declare const Markdown: React$1.FC<MarkdownProps>;

interface DropdownProps {
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
   * Class name(s) to append to the component's default class (`dropdown`)
   */
  className?: string;
  /**
   * Text to display in the button that triggers the dropdown to open
   */
  triggerLabel?: string;
  /**
   * Class name(s) to apply to button that opens the dropdown menu
   * @default 'button'
   */
  triggerClassName?: string;
  /**
   * Class name(s) for the icon to display to the left of the trigger label (optional)
   */
  triggerIcon?: string | ReactNode;
  /**
   * List of strings to display inside the dropdown menu.
   * Omit this and use the children prop instead if you want supply components as dropdown items.
   */
  items?: React$1.ReactNode[];
  /**
   * Set to true to remove the arrow to the right of the trigger label
   */
  isArrowless?: boolean;
  /**
   * Set to true to make the dropdown menu open upwards
   */
  isUp?: boolean;
  /**
   * Set to true to align the dropdown menu with the right of the trigger
   */
  isRight?: boolean;
  /**
   * Set to false to keep the menu open when an item is clicked
   * @default true
   */
  closeOnSelection?: boolean;
}
/**
 * Generic dropdown menu that can render arbitrary items for display
 * and navigation purposes only (i.e. not for selecting options or performing actions that are not links)
 */
declare const Dropdown: React$1.FC<DropdownProps>;

interface ModalProps {
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
   * Class name applied to modal content div.
   * The "mpc-modal" and "modal" classes are added automatically
   */
  className?: string;
}
/**
 * Render modal that can be opened by a ModalTrigger within its same ModalContextProvider
 */
declare const Modal: React$1.FC<ModalProps>;

interface Props$2 {
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
   * Class name applied to the modal trigger span.
   * The "mpc-modal-trigger" class is added automatically
   */
  className?: string;
}
/**
 * Render a trigger that opens a ModalContent that is within the same ModalContextProvider
 */
declare const ModalTrigger: React$1.FC<Props$2>;

interface ModalContextProviderProps {
  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;
  /**
   * The current or default state of the modal. If true, the "is-active" class is added to <Modal/>.
   * This value can be watched and changed from outside the component (e.g. via dash callback).
   */
  active?: boolean;
  /**
   * Prevent modal from being closed without completion of a specific action.
   * If set, there must be a button within the modal that updates the "active"
   * state using the ModalContext or a dash callback on the active prop.
   */
  forceAction?: boolean;
}
/**
 * Wrap a `ModalTrigger` component and a `Modal` component inside a `ModalContextProvider` to render an element (trigger) that
 * will open up a modal. Apply props to the `ModalContextProvider`.
 */
declare const ModalContextProvider: React$1.FC<ModalContextProviderProps>;

interface TabsProps {
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
   * Class name applied to top level wrapper for tabs and tab content.
   * The "mpc-tabs" class is added automatically
   */
  className?: string;
  /**
   * Content for each tab. Each top-level element will be the content for a tab.
   * The order of the elements inside of children should correspond to the order of the `labels` prop.
   */
  children: ReactNode;
  /**
   * List of strings to use as labels for the tabs.
   * The number of labels must equal the number of children (i.e. tab content items).
   */
  labels: string[];
  /**
   * The current or default tabIndex to be active.
   * This value can be watched and changed from outside the component (e.g. via dash callback).
   */
  tabIndex?: number;
  /**
   * Allow an object of arbitrary props to also
   * be added to the react-tabs component.
   *
   * This is workaround to let the Dash component
   * version of this component accept extra props
   * supported by react-tabs without the need to explicitly
   * define those props in the component's propTypes.
   */
  arbitraryProps?: object;
}
/**
 * Render content as labeled tabs.
 * This component will only render a tab's content once it has been activated.
 * After it's been activated, the tab's content will stay rendered and will be
 * shown/hidden using css only.
 * The react-tabs library is used under the hood but usage has been modified to make this component dash-friendly.
 * See https://github.com/reactjs/react-tabs
 */
declare const Tabs: React$1.FC<TabsProps>;

interface FilterFieldProps {
  id?: string;
  className?: string;
  /**
   * Label to display above the filter component
   */
  label?: string;
  /**
   * Tooltip to show when hovering over the filter label
   */
  tooltip?: string;
  /**
   * Units used in this filter
   */
  units?: string;
  /**
   * List of DOIs to display as compact publication buttons next to the label.
   * Use this for filters that need to cite specific publications.
   */
  dois?: string[];
  /**
   * Control whether the filter appears to be active
   */
  active?: boolean;
  resetFilter?: (id: any) => any;
}
/**
 * Common wrapper for filters/inputs and their labels
 */
declare const FilterField: React$1.FC<FilterFieldProps>;

interface DataTableProps {
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
   * Class name(s) to append to the component's default class.
   * By default, the .box and .p-0 classes are applied to the table, but these will be
   * overridden if a className is supplied.
   */
  className?: string;
  /**
   * Array of data objects to display in the table
   */
  data: any[];
  /**
   * An array of column definition objects to control what is rendered in the table.
   * See `Column` documentation for specifics on how to construct `Column` objects.
   */
  columns?: Column[];
  /**
   * Optionally include a field to sort by on initial load
   * Must be a valid field and included in your list of columns
   */
  sortField?: string;
  /**
   * If including a sortField, set whether it should ascend by default
   * True for ascending, False for descending
   */
  sortAscending?: boolean;
  /**
   * Optionally include a secondary sort field. If the sortField ever becomes the same as
   * the secondarySortField, the secondary field is removed.
   * Must be a valid field and included in your list of columns.
   */
  secondarySortField?: string;
  /**
   * If including a secondarySortField, set whether it should ascend by default.
   * True for ascending, False for descending.
   */
  secondarySortAscending?: boolean;
  /**
   * List of conditions for styling rows based on a property (selector) and a value.
   * Note that this prop currently only supports checking for
   * value equivalence (i.e. row[selector] === value).
   * See `ConditionalRowStyle` documentation for how to construct `ConditionalRowStyle` conditions.
   */
  conditionalRowStyles?: ConditionalRowStyle[];
  /**
   * Optionally include/exclude checkboxes next to rows for selecting
   */
  selectableRows?: boolean;
  /**
   * Property to maintain the state of selected rows so that
   * they are accessible via Dash callback
   */
  selectedRows?: any[];
  /**
   * Combine with selectableRows prop to only allow one row to be selected at a time.
   */
  singleSelectableRows?: boolean;
  /**
   * Set to true to show a header with total number of rows and a columns selector
   */
  hasHeader?: boolean;
  /**
   * Optional class name to apply to the table header
   */
  headerClassName?: string;
  /**
   * A noun in singular form to describe what a result represents (e.g. "material").
   * This is displayed in the table header.
   */
  resultLabel?: string;
  /**
   * Plural form of the result label. If none supplied, it will automatically be the result label plus an "s"
   */
  resultLabelPlural?: string;
  /**
   * Set to true to paginate the table records
   */
  pagination?: boolean;
  /**
   * If true, an expanded component will be used for pagination (same as in `SearchUI`).
   * If false, a compact version will be used.
   */
  paginationIsExpanded?: boolean;
  /**
   * Content to display below the table but inside the table's box wrapper.
   * Accepts markdown.
   */
  footer?: ReactNode;
  /**
   * This is a temporary solution to allow SearchUI's to render in Storybook.
   * There is an issue with the dynamic column header components that causes
   * Storybook to crash. Rendering column headers as plain strings fixes the problem.
   * Note that this will disable column tooltips and unit labels.
   */
  disableRichColumnHeaders?: boolean;
}
/**
 * Component for rendering data in a table.
 * Uses react-data-table-component under the hood.
 */
declare const DataTable: React$1.FC<DataTableProps>;

interface EnlargeableProps$1 {
  /**
   * The ID used to identify this component in Dash callbacks.
   */
  id?: string;
  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps?: (value: any) => any;
  /**
   * Additional class to apply to the modal-content element
   */
  className?: string;
  expanded?: boolean;
  setExpanded?: Dispatch<SetStateAction<boolean>>;
  hideButton?: boolean;
}
/**
 * Wrap around a content or a component to enable that content to be enlarged in a full screen modal.
 */
declare const Enlargeable: React$1.FC<EnlargeableProps$1>;

interface SwitchProps {
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
   * Class name(s) to append to the component's default class.
   */
  className?: string;
  /**
   * Value of the input, either true or false.
   */
  value?: boolean;
  /**
   * Whether to show a label to the right of the switch.
   */
  hasLabel?: boolean;
  /**
   * Text to show when the switch is on.
   * @default 'On'
   */
  truthyLabel?: string;
  /**
   * Text to show when the switch is off.
   * @default 'Off'
   */
  falsyLabel?: string;
  onChange?: (value: boolean) => any;
}
/**
 * Simple boolean switch
 */
declare const Switch: React$1.FC<SwitchProps>;

interface RangeSliderProps {
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
   * Class name(s) to append to the component's default class.
   */
  className?: string;
  /**
   * Array with the minimum and maximum possible values.
   * If using isLogScale, these values will be interpreted as exponents and will be transformed to be `10^x`.
   */
  domain: number[];
  /**
   * Value of the slider.
   * If using isLogScale, the display value of the slider will be `10^props.value`
   */
  value?: number | string;
  /**
   * Number by which the slider handles should move with each step.
   * Defaults to 1.
   */
  step?: number;
  /**
   * Use a logarithmic scale for the slider.
   * Domain values will be interpreted as exponents and will be transformed to be `10^x`.
   * So a domain of `[-1, 2]` will yields a range of `[0.01, 100]`.
   * Note that when using a log scale, the `value` prop will always be the pre-transformed value.
   */
  isLogScale?: boolean;
  /**
   * Number of milliseconds that should pass between typing into the slider
   * number input and the slider handles updating.
   */
  debounce?: number;
  /**
   * Number of ticks to show on the slider scale.
   * Note that D3 will automatically convert this number to a multiple of 1, 2, 5, or 10.
   * Set to 2 to only include ticks at the min and max bounds of the scale.
   */
  ticks?: number | null;
  /**
   * Set to true to display a "+" with the upper bound tick (e.g. "100+").
   * Use this to indicate that the upper bound is inclusive (e.g. 100 or more).
   */
  inclusiveTickBounds?: boolean;
  /**
   * Function to call when slider values change.
   */
  onChange?: (values: number[]) => void;
}
/**
 * Slider input for selecting a single value in a range
 */
declare const RangeSlider: React$1.FC<RangeSliderProps>;

interface DualRangeSliderProps {
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
   * Class name(s) to append to the component's default class.
   */
  className?: string;
  /**
   * Array with the minimum and maximum possible values.
   * Note that the domain bounds will be made "nice" so that
   * the slider ticks can be placed on easy-to-read numbers.
   */
  domain: number[];
  /**
   * Array with the min and max values that the slider
   * should be set to.
   */
  value?: number[];
  valueMin?: number;
  valueMax?: number;
  /**
   * Number by which the slider handles should move with each step.
   * Defaults to 1.
   */
  step: number;
  /**
   * Use a logarithmic scale for the slider.
   * Domain values will be interpreted as exponents and will be transformed to be `10^x`.
   * So a domain of `[-1, 2]` will yields a range of `[0.01, 100]`.
   * Note that when using a log scale, the `value` prop will always be the pre-transformed value.
   */
  isLogScale?: boolean;
  /**
   * Number of milliseconds that should pass between typing into the slider
   * number input and the slider handles updating.
   */
  debounce?: number;
  /**
   * Number of ticks to show on the slider scale.
   * Note that D3 will automatically convert this number to a multiple of 1, 2, 5, or 10.
   * Set to 2 to only include ticks at the min and max bounds of the scale.
   */
  ticks?: number | null;
  /**
   * Set to true to display a "+" with the upper bound tick (e.g. "100+").
   * Use this to indicate that the upper bound is inclusive (e.g. 100 or more).
   */
  inclusiveTickBounds?: boolean;
  /**
   * Function to call when slider values change.
   */
  onChange?: (min: number, max: number) => void;
  /**
   * Function to call when the slider props change.
   * This can be used to lift the new "nice" domain upwards.
   */
  onPropsChange?: (props: any) => void;
}
/**
 * Slider input with controls for both the minimum and maximum bounds.
 */
declare const DualRangeSlider: React$1.FC<DualRangeSliderProps>;

/**
 * A component for building a customizable, integrated search interface that can fetch and filter data from a REST API.
 * This component generates a state context which can be shared by its inner components.
 */
declare const SearchUIContainer: React$1.FC<SearchUIContainerProps>;

declare type MaterialsInputTypesMap = Partial<Record<MaterialsInputType, any>>;

interface SearchUISearchBarProps {
  /**
   * Class name(s) to add to the input field
   * @default 'is-medium'
   */
  className?: string;
  /**
   * Optionally add a string of text to show up in the top-level search bar
   */
  placeholder?: string;
  /**
   * Custom error message to display with the top-level search bar
   * if the user types an invalid value
   */
  errorMessage?: string;
  /**
     * Object with keys of allowed input types for the top-level search bar.
     * Keys must be one of these supported input types: "elements", "formula", "mpid", "smiles", "text."
     * Each key object must have a "field" property which maps the input type
     * to a valid data filter field in the API.
     *
     * e.g.
       
       {
         formula: {
           field: 'formula'
         },
         elements: {
           field: 'elements'
         },
         mpid: {
           field: 'material_ids'
         }
       }
     */
  allowedInputTypesMap?: MaterialsInputTypesMap;
  /**
   * Modes for showing the periodic table with the top search bar
   * "toggle": render a button for toggling visibility of periodic table
   * "focus": show periodic table when input is focuses, hide on blur
   * "none": never show the periodic table for this input
   * @default 'toggle'
   */
  periodicTableMode?: PeriodicTableMode;
  /**
     * Search examples to include below the search bar input.
     * This will display when input is in focus and empty, or when the help button is clicked.
     * Expects an array of items with the following properties:
     * "label": text to display before examples. If only "label" and no "examples", text will render as small.
     * "examples": array of input examples. These will become clickable and will update the input value.
     * e.g.
       [
         {
           label: 'Search Examples'
         },
         {
           label: 'Include at least elements',
           examples: ['Li,Fe', 'Si,O,K']
         }
       ]
     */
  helpItems?: InputHelpItem[];
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
}
/**
 * A specific version of the `MaterialsInput` component used within the `SearchUIContainer`
 * for performing top level searches by mp-id, formula, or elements.
 * The input value is parsed into its appropriate search field upon submission.
 */
declare const SearchUISearchBar: React$1.FC<SearchUISearchBarProps>;

/**
 * Render information about SearchUI results as well as controls
 * for modifying the data in the results view.
 */
declare const SearchUIDataHeader: React$1.FC;

/**
 * Component for rendering SearchUI data in a certain view dynamically
 * based on the current view state, error state, and number
 * of results. The view is determined by the `SearchUIContainer`'s `view` prop.
 */
declare const SearchUIDataView: React$1.FC;

/**
 * Component for rendering a panel of filters that are part of a SearchUI component
 */
interface Props$1 {
  className?: string;
}
declare const SearchUIFilters: React$1.FC<Props$1>;

/**
 * A component that combines the filters, data header, and data view
 * of a `SearchUI` into a common grid layout.
 * Note that this must be used within a `SearchUIContainer`.
 */
declare const SearchUIGrid: React$1.FC;

interface EnlargeableProps {
  /**
   * A unique ID to use to open and close the drawer in its `DrawerContextProvider`.
   * This id should be passed to the `forDrawerId` prop in a `DrawerTrigger`
   * that sits inside the same `DrawerContextProvider`.
   * Also used to identify this component in Dash callbacks.
   */
  id: string;
  /**
   * Dash-assigned callback that should be called to report property changes
   * to Dash, to make them available for callbacks.
   */
  setProps?: (value: any) => any;
  /**
   * Additional class to apply to drawer
   */
  className?: string;
}
/**
 * Render a right-side drawer that can be opened and closed.
 * A `Drawer` must be used inside of a `DrawerContextProvider` and must have a
 * corresponding `DrawerTrigger` within the same context.
 * The `id` of a drawer should be passed to the `forDrawerId` prop of a `DrawerTrigger` to open/close the drawer.
 */
declare const Drawer: React$1.FC<EnlargeableProps>;

interface LinkProps {
  /**
   * The children of this component
   */
  children: ReactNode;
  /**
   * The URL of a linked resource.
   */
  href: string;
  /**
   * Specifies where to open the link reference.
   */
  target?: string;
  /**
   * Controls whether or not the page will refresh when the link is clicked
   */
  refresh?: boolean;
  /**
   * Adds the title attribute to your link, which can contain supplementary
   * information.
   */
  title?: string;
  /**
   * Often used with CSS to style elements with common properties.
   */
  className?: string;
  /**
   * Defines CSS styles which will override styles previously set.
   */
  style?: object;
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id?: string;
  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state?: any;
  /**
   * If true, the current query parameters will not be removed from the url
   * when following the link.
   */
  preserveQuery?: boolean;
}
/**
 * Link component adapted from dash-core-components that allows you to create a clickable link within a multi-page dash app.
 * This creates a dash-compatible link, but the link will not be compatible with react-router. Use this component when you need to
 * have a dash link embedded inside a react component or you need to use the `preserveQuery` option which does not exist
 * on the original `dcc.Link` component.
 *
 * See: https://github.com/plotly/dash/blob/dev/components/dash-core-components/src/components/Link.react.js
 */
declare const Link: React$1.FC<LinkProps>;

interface DrawerState {
  activeDrawer: string | null;
  setActiveDrawer: (value: any) => any;
}
/**
 * Wrap a `DrawerTrigger` component and a `Drawer` component inside a `DrawerContextProvider` to render an element (trigger) that
 * will open up a modal. Apply props to the `DrawerContextProvider`.
 */
declare const DrawerContextProvider: React$1.FC;
/**
 * Custom hook for consuming the DrawerContext
 * Must only be used by child components of DrawerContextProvider
 */
declare const useDrawerContext: () => DrawerState;

interface Props {
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
   * Class name applied to the drawer trigger span.
   * The "mpc-drawer-trigger" class is added automatically
   */
  className?: string;
  /**
   * The ID of the drawer that this trigger should open.
   */
  forDrawerId: string;
}
/**
 * Render a trigger that opens a ModalContent that is within the same ModalContextProvider
 */
declare const DrawerTrigger: React$1.FC<Props>;

/**
 * A version of the `DataTable` component for rendering SearchUI results in the table view.
 * Uses react-data-table-component to render results based
 * on the current state of the SearchUIContext.
 */
declare const SearchUIDataTable: React$1.FC;

interface OpenAccessButtonProps {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;
  /**
   * Class name(s) to append to the component's default class (mpc-open-access-button)
   * @default 'tag'
   */
  className?: string;
  /**
   * The DOI (Digital Object Identifier) of the publication
   * Will be used to fetch an open access PDF link.
   */
  doi?: string;
  /**
   * Directly supply the URL to an openly accessible PDF of the reference.
   * If supplied, the component will not try to fetch an open access URL.
   */
  url?: string;
  /**
   * Value to add to the anchor tag's target attribute
   * @default '_blank'
   */
  target?: string;
  /**
   * Only display the open access icon and hide the label.
   */
  compact?: boolean;
}
/**
 *
 */
declare const OpenAccessButton: React$1.FC<OpenAccessButtonProps>;

/**
 * Check whether a filter value is considered empty or not (i.e. active or inactive)
 */
declare const isNotEmpty: (value: any) => boolean;
/**
 * Initialize filter groups to be usable within the search state.
 * This allows options to be programatically added for symmetry filters.
 * @param filterGroups array filter definitions nested by group
 * @returns new array of filter groups ready to use in the state
 */
declare const initFilterGroups: (filterGroups: FilterGroup[]) => FilterGroup[];
/**
 * Update the search state's active filters.
 * The activeFilters list is recomputed whenever a filter is modified in the UI.
 */
declare const getActiveFilters: (
  filterGroups: FilterGroup[],
  query: DecodedValueMap<QueryParamConfigMap>
) => ActiveFilter[];
/**
 * Create the query param config object based on the filter definitions.
 * This determines the keys in the query param object and assigns param types
 * to each key to determine how the param is encoded/decoded in the URL.
 * @param filterGroups filter definitions by nested group
 * @param sortKey key to use for the sort param
 * @param limitKey key to use for the result limit param
 * @param skipKey key to use for the skip amount (which index should the range of results start from)
 * @returns config that maps query params to param types
 */
declare const initQueryParams: (
  filterGroups: FilterGroup[],
  sortKey: string,
  limitKey: string,
  skipKey: string
) => QueryParamConfigMap;
/**
 * Apply transformations to the query param values before sending them to the API.
 * @param query object of query params and their values.
 * @param filterGroups filter definitions nested by group.
 * @param defaultQuery
 * @returns object of query params with API-ready values.
 */
declare const preprocessQueryParams: (
  query: DecodedValueMap<QueryParamConfigMap>,
  filterGroups: FilterGroup[],
  defaultQuery: any,
  sortParamKey: string
) => {};
declare const convertMaterialsInputTypesMapToArray: (
  map: MaterialsInputTypesMap
) => MaterialsInputType[];
declare const mapInputTypeToField: (
  inputType: MaterialsInputType,
  allowedInputTypesMap: MaterialsInputTypesMap
) => any;

/**
 * Component that wraps all of its children in providers for SearchUIContext and SearchUIContextActions
 * Accepts the same props as SearchUI and uses them to build the context state
 */
declare const SearchUIContextProvider: React$1.FC<SearchState>;
/**
 * Custom hook for consuming the SearchUIContext
 * Must only be used by child components of SearchUIContextProvider
 * The context returns one property called "state"
 */
declare const useSearchUIContext: () => SearchContextValue;
/**
 * Custom hook for consuming the SearchUIContextActions
 * Must only be used by child components of SearchUIContextProvider
 * The context returns one property called "actions"
 */
declare const useSearchUIContextActions: () => any;

export {
  ActiveFilter,
  BibCard,
  BibFilter,
  BibjsonCard,
  BibtexButton,
  CameraContextProvider,
  Column,
  ColumnFormat,
  ConditionalRowStyle,
  CrossrefCard,
  CrystalToolkitScene,
  DataBlock,
  DataTable,
  Download,
  DownloadButton,
  DownloadDropdown,
  Drawer,
  DrawerContextProvider,
  DrawerTrigger,
  Dropdown,
  DualRangeSlider,
  Enlargeable,
  Filter,
  FilterField,
  FilterGroup,
  FilterType,
  FilterValues,
  Formula,
  GlobalSearchBar,
  JsonView,
  Link,
  Markdown,
  MaterialsInput,
  MaterialsInputProps,
  MaterialsInputType,
  Modal,
  ModalContextProvider,
  ModalTrigger,
  Navbar,
  NavbarDropdown,
  OpenAccessButton,
  PeriodicContext,
  PeriodicTableMode,
  PublicationButton,
  RangeSlider,
  ReactGraphComponent,
  Scene,
  Scrollspy,
  SearchContextValue,
  SearchParam,
  SearchParams,
  SearchState,
  SearchUIContainer,
  SearchUIContainerProps,
  SearchUIContextProvider,
  SearchUIDataHeader,
  SearchUIDataTable,
  SearchUIDataView,
  SearchUIFilters,
  SearchUIGrid,
  SearchUISearchBar,
  SearchUIViewType,
  SearchUIViewTypeMap,
  Select,
  SelectableTable,
  Sidebar,
  StandalonePeriodicComponent,
  Switch,
  SynthesisRecipeCard,
  TableFilter,
  Tabs,
  Tooltip,
  convertMaterialsInputTypesMapToArray,
  getActiveFilters,
  initFilterGroups,
  initQueryParams,
  isNotEmpty,
  mapInputTypeToField,
  preprocessQueryParams,
  searchUIViewsMap,
  useDrawerContext,
  useSearchUIContext,
  useSearchUIContextActions
};
