import '../css/shortcode.css';

/**
 * Show the game in the iframe on click of the shortcode's button
 */
document.querySelectorAll('.sr-portal')?.forEach((wrap) => {
	wrap.addEventListener('click', function (e) {
		if (e.target.tagName !== 'BUTTON') {
			return;
		}
		wrap.classList.add('is-active');
		const iframe = wrap.querySelector('.sr-portal-iframe');
		iframe.src = iframe.dataset.src;
	});
});

/**
 * Show the game in a lightbox on click of any triggering link
 *
 * Simply link to #shelf-runner to open this lightbox. Note that if there
 * are multiple light boxes, this will always imply show the first one.
 */
const srLightbox = document.querySelector('.sr-portal-lightbox');
if (srLightbox) {
	const links = document.querySelectorAll('a[href="#shelf-runner"]');
	const iframe = srLightbox.querySelector('.sr-portal-iframe');
	links.forEach((link) => {
		link.addEventListener('click', function (event) {
			event.preventDefault();
			srLightbox.showModal();
			iframe.src = iframe.dataset.src;

			// Add load event listener with fallback timeout
			const loadTimeout = setTimeout(() => {
				iframe.classList.add('is-loaded');
			}, 1000);

			iframe.addEventListener('load', function () {
				clearTimeout(loadTimeout);
				iframe.classList.add('is-loaded');
			});
			document.body.classList.add('sr-lightbox-open');
		});
	});
	// Re-enable scrolling when dialog closes
	srLightbox.addEventListener('close', function () {
		iframe.src = '';
		document.body.classList.remove('sr-lightbox-open');
	});
}
