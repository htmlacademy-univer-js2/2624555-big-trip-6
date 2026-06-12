import View from './view.js';
import DateFormat from '../const/date-format.js';
import { formatDisplayDate } from '../utils/date-utils.js';
import { escapeHtml } from '../utils/text-utils.js';

function createTripInfoTemplate({ title = '', start = '', end = '', total = 0 } = {}) {
  const dates = start && end ? `${escapeHtml(start)}&nbsp;&mdash;&nbsp;${escapeHtml(end)}` : '';

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${escapeHtml(title)}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${escapeHtml(total)}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends View {
  #data = null;

  constructor(data = {}) {
    super();
    this.#data = data;
  }

  get template() {
    const start = this.#data.startDate ? formatDisplayDate(this.#data.startDate, DateFormat.TRIP_INFO_DATE) : '';
    const end = this.#data.endDate ? formatDisplayDate(this.#data.endDate, DateFormat.TRIP_INFO_DATE) : '';
    return createTripInfoTemplate({ title: this.#data.title, start, end, total: this.#data.total });
  }

  update(data = {}) {
    this.#data = { ...this.#data, ...data };

    if (this._element) {
      const oldElement = this._element;
      this._element = null;
      const newElement = this.getElement();
      oldElement.replaceWith(newElement);
    }
  }
}
