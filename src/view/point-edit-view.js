import { createElement } from '../render.js';

function createOffersTemplate(offers) {
  return offers.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" type="checkbox" checked>
      <label class="event__offer-label">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `).join('');
}

function createPointEditTemplate(point, destination, offers) {
  const { basePrice, type } = point;

  return `
    <li class="trip-events__item">
      <form class="event event--edit">
        <header class="event__header">

          <div class="event__type-wrapper">
            <img class="event__type-icon" src="img/icons/${type}.png">
          </div>

          <div class="event__field-group">
            <input class="event__input" type="text" value="${destination.name}">
          </div>

          <div class="event__field-group">
            <input class="event__input" type="text" value="${basePrice}">
          </div>

          <button type="submit">Save</button>
        </header>

        <section class="event__details">
          <div class="event__available-offers">
            ${createOffersTemplate(offers)}
          </div>

          <p>${destination.description}</p>
        </section>
      </form>
    </li>
  `;
}

export default class PointEditView {
  constructor(point, destination, offers) {
    this.point = point;
    this.destination = destination;
    this.offers = offers;
  }

  getTemplate() {
    return createPointEditTemplate(this.point, this.destination, this.offers);
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
