import { createElement } from '../render.js';

function createOffersTemplate(offers) {
  return offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('');
}

function createPointTemplate(point, destination, offers) {
  const { basePrice, dateFrom, dateTo, type, isFavorite } = point;

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date">${dateFrom}</time>

        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>

        <h3 class="event__title">${type} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time>${dateFrom}</time>
            —
            <time>${dateTo}</time>
          </p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span>${basePrice}</span>
        </p>

        <ul class="event__selected-offers">
          ${createOffersTemplate(offers)}
        </ul>

        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
        </button>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class PointView {
  constructor(point, destination, offers) {
    this.point = point;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return createPointTemplate(this.point, this.destination, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
