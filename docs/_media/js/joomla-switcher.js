(function () {
	if (!document.getElementById('joomla-switcher-stylesheet')) {
		const style = document.createElement('style');
		style.id = 'joomla-switcher-stylesheet';
		style.innerHTML = `joomla-switcher{display:inline-flex;height:28px;box-sizing:border-box}joomla-switcher .switcher{position:relative;box-sizing:border-box;display:inline-block;width:62px;height:28px;vertical-align:middle;cursor:pointer;user-select:none;background-color:#f2f2f2;background-clip:content-box;border:1px solid rgba(0,0,0,.18);border-radius:.25rem;box-shadow:0 0 0 0 #dfdfdf inset;transition:border .4s ease 0s,box-shadow .4s ease 0s}joomla-switcher .switcher.active{background-color:#5cb85c;border-color:#5cb85c;box-shadow:0 0 0 calc(28px / 2) #5cb85c inset;transition:border .4s ease 0s,box-shadow .4s ease 0s,background-color 1.2s ease 0s}joomla-switcher .switcher-danger.switcher.active{background-color:#d9534f;border-color:#d9534f;box-shadow:0 0 0 calc(28px / 2) #d9534f inset}joomla-switcher .switcher-primary.switcher.active{background-color:#0275d8;border-color:#0275d8;box-shadow:0 0 0 calc(28px / 2) #0275d8 inset}joomla-switcher input{position:absolute;top:0;left:0;z-index:2;width:62px;height:28px;padding:0;margin:0;cursor:pointer;opacity:0}joomla-switcher .switch{position:absolute;top:0;width:calc(62px / 2);height:calc(28px - (1px * 2));background:#fff;border-radius:.25rem;box-shadow:0 0 1px rgba(0,0,0,.1) inset,0 1px 3px rgba(0,0,0,.15);transition:left .2s ease 0s}joomla-switcher input:checked~.switch{left:0}joomla-switcher input~:checked~.switch{left:calc((62px / 2) - (1px * 2))}joomla-switcher input:checked{z-index:0}joomla-switcher .switcher-labels{position:relative}joomla-switcher .switcher-labels span{position:absolute;top:0;left:10px;color:#636c72;visibility:hidden;opacity:0;transition:all .2s ease-in-out}joomla-switcher .switcher-labels span.active{visibility:visible;opacity:1;transition:all .2s ease-in-out}`;
		document.head.appendChild(style);
	}
})();

class SwitcherElement extends HTMLElement {
	/* Lifecycle, element created */
	constructor() {
		super();
	}

	/* Method to get the translated text */
	createMarkup(switcher) {
		let inputs  = [].slice.call(switcher.querySelectorAll('input')),
		    checked = 0;

		// Create the first 'span' wrapper
		let spanFirst = document.createElement('span');
		spanFirst.classList.add('switcher');
		spanFirst.classList.add(switcher.getAttribute('class'));

		let switchEl = document.createElement('span');
		switchEl.classList.add('switch');

		inputs.forEach(function(input, index) {
			spanFirst.appendChild(input);

			if (index === 1 && input.checked) {
				checked = 1;
			}
		});

		spanFirst.appendChild(switchEl);

		// Create the second 'span' wrapper
		let spanSecond = document.createElement('span');
		spanSecond.classList.add('switcher-labels');

		let labelFirst = document.createElement('span');
		labelFirst.classList.add('switcher-label-0');
		labelFirst.innerText = this.getText(switcher.getAttribute('offText'), 'Off');

		let labelSecond = document.createElement('span');
		labelSecond.classList.add('switcher-label-1');
		labelSecond.innerText = this.getText(switcher.getAttribute('onText'), 'On');

		if (checked === 0) {
			labelFirst.classList.add('active');
		}
		else {
			labelSecond.classList.add('active');
		}

		spanSecond.appendChild(labelFirst);
		spanSecond.appendChild(labelSecond);

		// Remove all child nodes from the switcher
		while (switcher.firstChild) {
			switcher.removeChild(switcher.firstChild);
		}

		// Append everything back to the main element
		switcher.appendChild(spanFirst);
		switcher.appendChild(spanSecond);

		return switcher;
	}

	/* Lifecycle, element appended to the DOM */
	connectedCallback() {
		const self = this;

		// Create the markup
		this.createMarkup(self);

		// Add the initial active class
		const inputs    = [].slice.call(self.querySelectorAll('input')),
			  container = self.querySelector('span.switcher'),
			  next      = inputs[1].parentNode.nextElementSibling;

		// Add tab focus
		container.setAttribute('tabindex', 0);

		if (inputs[1].checked) {
			inputs[1].parentNode.classList.add('active');
			next.querySelector('.switcher-label-' + inputs[1].value).classList.add('active');
		}
		else {
			next.querySelector('.switcher-label-' + inputs[0].value).classList.add('active');
		}

		inputs.forEach(function(switchEl) {
			// Add the required accessibility tags
			if (switchEl.id) {
				const parent      = switchEl.parentNode,
					  relatedSpan = parent.nextElementSibling.querySelector('span.switcher-label-' + switchEl.value);

				relatedSpan.id = switchEl.id + '-label';
				switchEl.setAttribute('aria-labelledby', relatedSpan.id);
			}

			// Remove the tab focus from the inputs
			switchEl.setAttribute('tabindex', '-1');

			// Add the active class on click
			switchEl.addEventListener('click', function (event) {
				self.toggle(event.target);
			});
		});

		container.addEventListener('keydown', function (event) {
			if (event.keyCode === 13 || event.keyCode === 32) {
				event.preventDefault();
				const element = container.querySelector('input:not(.active)')
				element.click();
			}
		});
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

	toggle(element) {
		const parent    = element.parentNode,
			  wasActive = parent.querySelectorAll('input.active'),
			  inputs    = [].slice.call(parent.querySelectorAll('input')),
			  spans     = [].slice.call(parent.nextElementSibling.querySelectorAll('span'));

		spans.forEach(function (span) {
			span.classList.remove('active');
		});

		if (parent.classList.contains('active')) {
			parent.classList.remove('active');
		}
		else {
			parent.classList.add('active');
		}

		if (!element.classList.contains('active')) {
			inputs.forEach(function(input) {
				input.classList.remove('active');
				input.removeAttribute('checked');
			});
			element.classList.add('active');

			this.dispatchCustomEvent('joomla.switcher.on');
		}
		else {
			inputs.forEach(function (input) {
				input.classList.remove('active');
				input.removeAttribute('checked');
			});

			this.dispatchCustomEvent('joomla.switcher.off');
		}

		const newActive = inputs.filter(item => item !== wasActive);

		newActive[0].setAttribute('checked', '');
		parent.nextElementSibling.querySelector('.switcher-label-' + element.value).classList.add('active');
	}

	/* Method to get the translated text */
	getText(str, fallback) {
		return (window.Joomla && Joomla.JText && Joomla.JText._ && typeof Joomla.JText._ === 'function' && Joomla.JText._(str)) ? Joomla.JText._(str) : fallback;
	}
}
customElements.define('joomla-switcher', SwitcherElement);
