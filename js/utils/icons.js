const paths = {
  "north-east": '<path d="M6 18 18 6M8 6h10v10"/>',
  north: '<path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/>',
  south: '<path d="M12 5v14M6.5 13.5 12 19l5.5-5.5"/>'
};

export function createArrowIcon(direction = "north-east", className = "") {
  const path = paths[direction] || paths["north-east"];
  const classes = ["ui-arrow", `ui-arrow--${direction}`, className]
    .filter(Boolean)
    .join(" ");

  return `
    <svg class="${classes}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      ${path}
    </svg>
  `;
}
