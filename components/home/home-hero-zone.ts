/**
 * The V2 homepage hero carries its own nav, so on "/" the floating chrome
 * (site header, WhatsApp bubble) stays out of the way until the visitor has
 * scrolled most of the hero away.
 */
export function inHomeHero(pathname: string) {
  return pathname === "/" && window.scrollY < window.innerHeight * 0.85;
}

/**
 * True once the homepage's closing section (#visit) fills the lower part of the
 * screen: it carries every contact option, and the WhatsApp bubble would sit on
 * its footer links.
 */
export function inHomeClosing(pathname: string) {
  if (pathname !== "/") return false;
  const closing = document.getElementById("visit");
  return !!closing && closing.getBoundingClientRect().top < window.innerHeight * 0.5;
}
