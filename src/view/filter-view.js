import View from './view.js';
import { escapeHtml } from '../utils/text-utils.js';

function createFilterTemplate(filters) {
  return (
    `<form class="trip-filters" action="#" method="get">
${filters.map((filter) => `      <div class="trip-filters__filter">
        <input id="filter-${escapeHtml(filter.type)}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${escapeHtml(filter.type)}"${filter.isChecked ? ' checked' : ''}${filter.isDisabled ? ' disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${escapeHtml(filter.type)}">${escapeHtml(filter.label)}</label>
      </div>`).join('\n')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends View {
  #changeHandler = null;

  #onFilterChange = null;

  #listenerAttached = false;

  constructor({ filters, onFilterChange = () => {} } = {}) {
    super();
    this.filters = filters ?? [];
    this.#onFilterChange = onFilterChange;
    this.#changeHandler = this.#handleChange;
  }

  get template() {
    return createFilterTemplate(this.filters);
  }

  getElement() {
    const element = super.getElement();

    if (!this.#listenerAttached) {
      element.addEventListener('click', this.#changeHandler);
      this.#listenerAttached = true;
    }

    return element;
  }

  removeElement() {
    super.removeElement();
    this.#listenerAttached = false;
  }

  #handleChange = (event) => {
    const filterLabel = event.target.closest('.trip-filters__filter-label');
    const filterInput = filterLabel
      ? this._element.querySelector(`#${filterLabel.htmlFor}`)
      : event.target.closest('.trip-filters__filter-input');

    if (!filterInput || filterInput.disabled) {
      return;
    }

    this.filters = this.filters.map((filter) => ({
      ...filter,
      isChecked: filter.type === filterInput.value,
    }));

    this.#onFilterChange(filterInput.value);
  };
}
