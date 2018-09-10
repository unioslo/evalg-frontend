export const mediaQueryMd = window.matchMedia("(min-width: 640px)");
export const mediaQueryLg = window.matchMedia("(min-width: 1140px)");

export const getScreenSize = (md, lg) => {
  if (lg.matches) {
    return 'lg';
  }
  if (md.matches) {
    return 'md';
  }
  return 'sm';
};