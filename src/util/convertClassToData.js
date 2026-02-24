/**
 * Convert classes to data attributes.
 *
 * We're using a Figma plugin that can export
 * SVG graphics with class names, but we want
 * data attributes. Should we stop using that
 * plugin, we could remove this and simply add
 * data attributes manually.
 *
 * @param {HTMLElement} elContainer The stage element to look within (e.g. SVG root).
 */
export const convertClassToData = (elContainer) => {
	elContainer.querySelectorAll('[class*="["')?.forEach((el) => {
		el.classList.forEach((className) => {
			if (className.startsWith('[')) {
				const pairs = className.substring(1).replace(/]/g, '').split('[');
				pairs.forEach((pair) => {
					const [key, value] = pair.split(':');
					el.setAttribute(`data-${key}`, value || '');
				});
				el.classList.remove(className);
				if (!el.classList.length) {
					el.removeAttribute('class');
				}
			}
		});
	});
};