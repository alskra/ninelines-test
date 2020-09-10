import {gsap} from 'gsap';

export default class FormSummary {
	#checkboxSelector = '.form-summary__checkbox-input';
	#ease = 'power1.inOut';

	constructor(element) {
		this.element = element;
		// eslint-disable-next-line no-underscore-dangle
		this.element._formSummary = this;
		this.scoreTarget = this.element.querySelector('.form-summary__score');
		this.meterArrowTarget = this.element.querySelector('.meter-arrow');

		this.element.addEventListener('change', (event) => {
			if ($(event.target).closest(this.#checkboxSelector)) {
				this.scoreCurrentUpdated();
			}
		});

		this.scoreTotalUpdated();
		this.scoreCurrentUpdated();
	}

	#calcRotate(value) {
		return value / this.scoreTotal * (149 + 36) - 36;
	}

	scoreTotalUpdated() {
		Array.from(this.scoreTotal.toString()).forEach(() => {
			this.scoreTarget.insertAdjacentHTML(
				'beforeend',
				`
					<span class="form-summary__score-digit-box">
						<span class="form-summary__score-digit is-active"></span>
						<span class="form-summary__score-digit"></span>
					</span>
				`
			);
		});
	}

	scoreCurrentUpdated() {
		if (!this.scoreAnimated) {
			this.scoreAnimated = 0;
		}

		let scorePrev = Math.round(this.scoreAnimated);

		gsap.to(this, {
			duration: this.duration,
			ease: this.#ease,
			overwrite: true,
			scoreAnimated: this.scoreCurrent,
			onUpdate: () => {
				const score = Math.round(this.scoreAnimated);

				if (score !== scorePrev || this.scoreAnimated === this.scoreCurrent) {
					const arrPrevScore = Array.from(scorePrev.toString().padStart(this.scoreTotal.toString().length, 'x'));
					const arrScore = Array.from(score.toString().padStart(this.scoreTotal.toString().length, 'x'));

					arrScore.forEach((digit, index) => {
						this.scoreTarget.children[index]
							.querySelectorAll('.form-summary__score-digit')
							.forEach((scoreDigitTarget) => {
								const isActive = scoreDigitTarget.classList.contains('is-active');

								if (digit !== arrPrevScore[index]) {
									if (!isActive) {
										scoreDigitTarget.textContent = digit === 'x' ? '' : digit;
									}

									scoreDigitTarget.classList.toggle('is-active', !isActive);
								} else {
									if (isActive) {
										scoreDigitTarget.textContent = digit === 'x' ? '' : digit;
									}
								}
							});
					});

					scorePrev = score;
				}
			},
		});

		gsap.to(this.meterArrowTarget, {
			duration: this.duration,
			ease: this.#ease,
			overwrite: true,
			startAt: {
				transformOrigin: '46px 30px',
				rotate: this.#calcRotate(this.scoreAnimated),
			},
			rotate: this.#calcRotate(this.scoreCurrent),
		});
	}

	get checkboxTargets() {
		return Array.from(this.element.querySelectorAll(this.#checkboxSelector));
	}

	get scoreTotal() {
		return this.checkboxTargets
			.reduce((previous, current) => {
				return previous + parseInt(current.value, 10);
			}, 0);
	}

	get scoreCurrent() {
		return this.checkboxTargets
			.reduce((previous, current) => {
				if (current.checked) {
					return previous + parseInt(current.value, 10);
				}

				return previous;
			}, 0);
	}

	get duration() {
		return Math.abs(this.scoreCurrent - this.scoreAnimated) / this.scoreTotal * 6;
	}

	static init() {
		Array.from(document.querySelectorAll('.form-summary'))
			.forEach((element) => {
				// eslint-disable-next-line no-underscore-dangle
				if (!element._formSummary) {
					// eslint-disable-next-line no-new
					new FormSummary(element);
				}
			});
	}
}

FormSummary.init();

