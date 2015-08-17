var attributes = [
  {
    attributeName : "maxContainerCols",
    attributeDefault : "2",
    attributeText : "The maximum amount of inner FormContainers per row that is used before a new row is started."
  },
  {
    attributeName : "minWidth",
    attributeDefault : "not defined",
    attributeText : "The overall minimal width in pixels that is used for the SimpleForm. If the available width is below the given minWidth the SimpleForm will create a new row for the next FormContainer. -1 value is default meaning that inner FormContainers will be stacked until maxCols is reached, irrespective if a maxWidth is reached or the available parents width is reached."
  },
  {
    attributeName : "width",
    attributeDefault : "not defined",
    attributeText : ""
  },
  {
    attributeName : "editable",
    attributeDefault : "not defined",
    attributeText : "Applies a device and theme specific line-height to the form elements if the form has editable content. In this case all (not only the editable) rows of the form will get the line height."
  },
  {
    attributeName : "labelMinWidth",
    attributeDefault : "not defined",
    attributeText : "Specifies the min-width in pixels of the label in all form containers."
  },
  {
    attributeName : "layout",
    attributeDefault : "192",
    attributeText : "The FormLayout that is used to render the SimpleForm."
  },
  {
    attributeName : "labelSpanL",
    attributeDefault : "4",
    attributeText : "Default span for labels in large size. This span is only used if more than 1 container is in one line, if only 1 container is in the line the labelSpanM value is used."
  },
  {
    attributeName : "labelSpanM",
    attributeDefault : "2",
    attributeText : "Default span for labels in medium size. This property is used for full size containers. If more than one Container is in one line, labelSpanL is used."
  },
  {
    attributeName : "labelSpanS",
    attributeDefault : "12",
    attributeText : "Default span for labels in small size."
  },
  {
    attributeName : "emptySpanL",
    attributeDefault : "0",
    attributeText : "Number of grid cells that are empty at the end of each line on large size."
  },
  {
    attributeName : "emptySpanM",
    attributeDefault : "0",
    attributeText : "Number of grid cells that are empty at the end of each line on medium size."
  },
  {
    attributeName : "emptySpanS",
    attributeDefault : "0",
    attributeText : "Number of grid cells that are empty at the end of each line on small size."
  },
  {
    attributeName : "columnsL",
    attributeDefault : "2",
    attributeText : "Form columns for large size. The number of columns for large size must not be smaller that the number of columns for medium size."
  },
  {
    attributeName : "columnsM",
    attributeDefault : "1",
    attributeText : "Form columns for medium size."
  },
  {
    attributeName : "breakpointL",
    attributeDefault : "1024",
    attributeText : "Breakpoint between Medium size and Large size."
  },
  {
    attributeName : "breakpointM",
    attributeDefault : "600",
    attributeText : "Breakpoint between Small size and Medium size."
  }
];
