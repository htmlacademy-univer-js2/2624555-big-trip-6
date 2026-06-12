import DateFormat from '../const/date-format.js';
import OFFER_CHECKBOX_NAME_PREFIX from '../const/offer.js';
import { DEFAULT_POINT_TYPE } from '../const/point-type.js';
import { formatDisplayDate } from '../utils/date-utils.js';
import { escapeHtml, getCapitalizedWord } from '../utils/text-utils.js';

const EMPTY_POINT = {
  type: '',
  destinationId: '',
  offerIds: [],
  dateFrom: '',
  dateTo: '',
  basePrice: '',
};

const FORM_ID_CREATION = 'new';
const FORM_ID_EDIT = 'edit';

function renderTypeOptions(pointTypes, currentType, idPrefix) {
  return pointTypes.map((type) => `
                <div class="event__type-item">
                  <input id="event-type-${escapeHtml(type)}-${escapeHtml(idPrefix)}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${escapeHtml(type)}"${type === currentType ? ' checked' : ''}>
                  <label class="event__type-label  event__type-label--${escapeHtml(type)}" for="event-type-${escapeHtml(type)}-${escapeHtml(idPrefix)}">${escapeHtml(getCapitalizedWord(type))}</label>
                </div>`).join('');
}

function renderDestinationOptions(destinations) {
  return destinations.map((destination) => `<option value="${escapeHtml(destination.city)}"></option>`).join('');
}

function renderAvailableOffers(offers, selectedOfferIds, idPrefix) {
  return offers.map((offer) => `
              <div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${escapeHtml(offer.id)}-${escapeHtml(idPrefix)}" type="checkbox" name="${OFFER_CHECKBOX_NAME_PREFIX}${escapeHtml(offer.id)}"${selectedOfferIds.includes(offer.id) ? ' checked' : ''}>
                <label class="event__offer-label" for="event-offer-${escapeHtml(offer.id)}-${escapeHtml(idPrefix)}">
                  <span class="event__offer-title">${escapeHtml(offer.title)}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${escapeHtml(offer.price)}</span>
                </label>
              </div>`).join('');
}

function hasDestinationDetails(destination) {
  if (!destination) {
    return false;
  }

  return Boolean(destination.description) || (destination.pictures?.length ?? 0) > 0;
}

function renderOffersSection(offers, type, selectedOfferIds, idPrefix) {
  const availableOffers = offers.filter((offer) => offer.type === type);

  if (availableOffers.length === 0) {
    return '';
  }

  return `
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
${renderAvailableOffers(availableOffers, selectedOfferIds, idPrefix)}
            </div>
          </section>`;
}

function renderDestinationSection(destination) {
  if (!hasDestinationDetails(destination)) {
    return '';
  }

  return `
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${escapeHtml(destination?.description)}</p>
${renderDestinationPhotos(destination)}
          </section>`;
}

function renderDestinationPhotos(destination) {
  const pictures = destination?.pictures ?? [];

  if (!pictures.length) {
    return '';
  }

  return `
            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${pictures.map((picture) => `<img class="event__photo" src="${escapeHtml(picture)}" alt="Event photo">`).join('')}
              </div>
            </div>`;
}

function createPointFormTemplate({
  point = EMPTY_POINT,
  destination = null,
  destinations = [],
  offers = [],
  selectedOfferIds = [],
  pointTypes = [],
  submitLabel,
  resetLabel,
  isCreation = false,
}) {
  const normalizedPoint = {
    ...EMPTY_POINT,
    ...point,
  };
  const formId = normalizedPoint.id ?? (isCreation ? FORM_ID_CREATION : FORM_ID_EDIT);
  const destinationValue = escapeHtml(destination?.city);
  const typeLabel = escapeHtml(getCapitalizedWord(normalizedPoint.type));
  const pointType = normalizedPoint.type || DEFAULT_POINT_TYPE;
  const startTime = escapeHtml(formatDisplayDate(normalizedPoint.dateFrom, DateFormat.FORM_DATE_TIME));
  const endTime = escapeHtml(formatDisplayDate(normalizedPoint.dateTo, DateFormat.FORM_DATE_TIME));

  return (`<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${escapeHtml(formId)}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${escapeHtml(pointType)}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${escapeHtml(formId)}" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
${renderTypeOptions(pointTypes, normalizedPoint.type, formId)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${escapeHtml(formId)}">${typeLabel}</label>
            <input class="event__input  event__input--destination" id="event-destination-${escapeHtml(formId)}" type="text" name="event-destination" value="${destinationValue}" list="destination-list-${escapeHtml(formId)}">
            <datalist id="destination-list-${escapeHtml(formId)}">
${renderDestinationOptions(destinations)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${escapeHtml(formId)}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${escapeHtml(formId)}" type="text" name="event-start-time" value="${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${escapeHtml(formId)}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${escapeHtml(formId)}" type="text" name="event-end-time" value="${endTime}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${escapeHtml(formId)}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${escapeHtml(formId)}" type="number" name="event-price" min="0" step="1" inputmode="numeric" value="${escapeHtml(normalizedPoint.basePrice)}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">${escapeHtml(submitLabel)}</button>
          <button class="event__reset-btn" type="reset">${escapeHtml(resetLabel)}</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
${renderOffersSection(offers, normalizedPoint.type, selectedOfferIds, formId)}
${renderDestinationSection(destination)}
        </section>
      </form>
    </li>`);
}

export { createPointFormTemplate };
