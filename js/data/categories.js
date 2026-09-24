export const ALL_PROJECTS_CATEGORY = "All";

export const PROJECT_CATEGORIES = [
  {
    value: "Brand Identity",
    label: "Brand Identity"
  },
  {
    value: "Graphic Design",
    label: "Graphic Design"
  },
  {
    value: "Web Design",
    label: "Web Design"
  }
];

export function getCategoryLabel(category) {
  if (category === ALL_PROJECTS_CATEGORY) return "Tutti";

  return PROJECT_CATEGORIES.find(({ value }) => value === category)?.label
    || category;
}

export function getAvailableWorkCategories(projects) {
  const availableCategories = PROJECT_CATEGORIES
    .map(({ value }) => value)
    .filter(category => projects.some(project => project.category === category));

  return [ALL_PROJECTS_CATEGORY, ...availableCategories];
}
