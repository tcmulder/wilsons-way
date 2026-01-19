import '../css/shortcode.css';

(function() {

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
	const lightboxElement = document.querySelector('.sr-portal-lightbox');
	if (lightboxElement) {
		const triggerLinks = document.querySelectorAll('a[href="#shelf-runner"]');
		const lightboxIframe = lightboxElement.querySelector('.sr-portal-iframe');
		triggerLinks.forEach((link) => {
			link.addEventListener('click', function (event) {
				event.preventDefault();
				lightboxElement.showModal();
				lightboxIframe.src = lightboxIframe.dataset.src;

				// Add load event listener with fallback timeout
				const loadTimeout = setTimeout(() => {
					lightboxIframe.classList.add('is-loaded');
				}, 1000);

				lightboxIframe.addEventListener('load', function () {
					clearTimeout(loadTimeout);
					lightboxIframe.classList.add('is-loaded');
				});
				document.body.classList.add('sr-lightbox-open');
			});
		});
		// Re-enable scrolling when dialog closes
		lightboxElement.addEventListener('close', function () {
			lightboxIframe.src = '';
			document.body.classList.remove('sr-lightbox-open');
		});
	}
})();