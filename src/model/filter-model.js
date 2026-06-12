import { DEFAULT_FILTER } from '../const/filter-type.js';

export default class FilterModel {
  #filter = DEFAULT_FILTER;

  getFilter() {
    return this.#filter;
  }

  setFilter(filter) {
    this.#filter = filter;
  }
}
