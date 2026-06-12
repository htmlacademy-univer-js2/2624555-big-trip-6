import View from './view.js';
import DateFormat from '../const/date-format.js';
import { DEFAULT_POINT_TYPE } from '../const/point-type.js';
import { MINUTES_IN_DAY, MINUTES_IN_HOUR, TIME_PAD_LENGTH } from '../const/time.js';
import { formatDisplayDate, getDurationMinutes } from '../utils/date-utils.js';
import { escapeHtml, getCapitalizedWord } from '../utils/text-utils.js';

function formatDuration(point) {
  if (!point?.dateFrom || !point?.dateTo) {
    return '';
  }

  const totalMinutes = getDurationMinutes(point.dateFrom, point.dateTo);

  if (totalMinutes < MINUTES_IN_HOUR) {
    return `${totalMinutes}M`;
  }

  const days = Math.floor(totalMinutes / MINUTES_IN_DAY);
  const hours = Math.floor((totalMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;

  if (days === 0) {
    return `${String(hours).padStart(TIME_PAD_LENGTH, '0')}H ${String(minutes).padStart(TIME_PAD_LENGTH, '0')}M`;
  }

  return `${String(days).padStart(TIME_PAD_LENGTH, '0')}D ${String(hours).padStart(TIME_PAD_LENGTH, '0')}H ${String(minutes).padStart(TIME_PAD_LENGTH, '0')}M`;
}

function createPointTemplate(point, destination, offers) {
  const pointDate = formatDisplayDate(point?.dateFrom, DateFormat.POINT_DATE).toUpperCase();
  const startTime = formatDisplayDate(point?.dateFrom, DateFormat.POINT_TIME);
  const endTime = formatDisplayDate(point?.dateTo, DateFormat.POINT_TIME);
  const duration = formatDuration(point);
  const favoriteClass = point?.isFavorite ? ' event__favorite-btn--active' : '';
  const pointType = point?.type ?? DEFAULT_POINT_TYPE;
  const selectedOffersMarkup = offers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${escapeHtml(offer.title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${escapeHtml(offer.price)}</span>
          </li>`).join('');

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${escapeHtml(point?.dateFrom)}">${escapeHtml(pointDate)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${escapeHtml(pointType)}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${escapeHtml(getCapitalizedWord(pointType))} ${escapeHtml(destination?.city)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${escapeHtml(point?.dateFrom)}">${escapeHtml(startTime)}</time>
            &mdash;
            <time class="event__end-time" datetime="${escapeHtml(point?.dateTo)}">${escapeHtml(endTime)}</time>
          </p>
          <p class="event__duration">${escapeHtml(duration)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${escapeHtml(point?.basePrice)}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
${selectedOffersMarkup}
        </ul>
        <button class="event__favorite-btn${favoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends View {
  #favoriteClickHandler = null;

  #rollupClickHandler = null;

  #favoriteButtonListenerAttached = false;

  #rollupButtonListenerAttached = false;

  constructor({ point, destination, offers, onFavoriteClick = () => {}, onRollupClick = () => {} } = {}) {
    super();
    this.point = point;
    this.destination = destination;
    this.offers = offers ?? [];
    this.#favoriteClickHandler = onFavoriteClick;
    this.#rollupClickHandler = onRollupClick;
  }

  get template() {
    return createPointTemplate(this.point, this.destination, this.offers);
  }

  getElement() {
    const element = super.getElement();

    if (!this.#favoriteButtonListenerAttached) {
      element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
      this.#favoriteButtonListenerAttached = true;
    }

    if (!this.#rollupButtonListenerAttached) {
      element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
      this.#rollupButtonListenerAttached = true;
    }

    return element;
  }

  removeElement() {
    super.removeElement();
    this.#favoriteButtonListenerAttached = false;
    this.#rollupButtonListenerAttached = false;
  }
}
