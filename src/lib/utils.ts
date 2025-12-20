export function cn(...classes: (string | undefined | boolean)[]) {
  const filteredClasses = classes.filter(Boolean);
  return filteredClasses.join(" ");
}