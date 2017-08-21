(function () {
	const css = `{{stylesheet}}`;
	if (!document.getElementById('joomla-switcher-stylesheet')) {
		const style = document.createElement('style');
		style.id = 'joomla-switcher-stylesheet';
		style.innerHTML = css;
		document.head.appendChild(style);
	}
})();

class SwitcherElement extends HTMLElement {
	/* Lifecycle, element created */
	constructor() {
		super();
	}

	/* Lifecycle, element appended to the DOM */
	connectedCallback() {
		const self = this;
		// Add the initial active class
		const switcher = this.querySelectorAll('input'),
			  next     = switcher[1].parentNode.nextElementSibling;

		if (!switcher.length) {
			throw new Error('Switcher not properly setup')
		}

		if (switcher[1].checked) {
			switcher[1].parentNode.classList.add('active');
			next.querySelector('.switcher-label-' + switcher[1].value).classList.add('active');
		}
		else
		{
			next.querySelector('.switcher-label-' + switcher[0].value).classList.add('active');
		}

		switcher.forEach(function(switchEl) {
			// Add the active class on click
			switchEl.addEventListener('click', function (event) {
				let el = event.target,
					parent = this.parentNode,
					spans = parent.nextElementSibling.querySelectorAll('span');

				spans.forEach(function(span) {
					span.classList.remove('active');
				});

				if (this.parentNode.classList.contains('active')) {
					this.parentNode.classList.remove('active');
				} else {
					this.parentNode.classList.add('active');
				}

				if (!this.classList.contains('active')) {
					this.classList.add('active');
					self.dispatchCustomEvent('joomla.switcher.on');
				}
				else {
					this.classList.remove('active');

					self.dispatchCustomEvent('joomla.switcher.off');
				}

				parent.nextElementSibling.querySelector('.switcher-label-' + this.value).classList.add('active');
			});
		})

	}

	/* Lifecycle, element removed from the DOM */
	disconnectedCallback() {
		this.removeEventListener('joomla.switcher.toggle', this);
		this.removeEventListener('joomla.switcher.on', this);
		this.removeEventListener('joomla.switcher.off', this);
		this.removeEventListener('click', this);
	}

	/* Method to dispatch events */
	dispatchCustomEvent(eventName) {
		let OriginalCustomEvent = new CustomEvent(eventName, {bubbles: true, cancelable: true});
		OriginalCustomEvent.relatedTarget = this;
		this.dispatchEvent(OriginalCustomEvent);
		this.removeEventListener(eventName, this);
	}
}
customElements.define('joomla-switcher', SwitcherElement);