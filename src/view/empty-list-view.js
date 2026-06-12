import View from './view.js';
import { escapeHtml } from '../utils/text-utils.js';

const DEFAULT_EMPTY_MESSAGE = 'Click New Event to create your first point';

function createEmptyListTemplate(message) {
  return `<p class="trip-events__msg">${escapeHtml(message)}</p>`;
}

export default class EmptyListView extends View {
  constructor({ message } = {}) {
    super();
    this.message = message ?? DEFAULT_EMPTY_MESSAGE;
  }

  get template() {
    return createEmptyListTemplate(this.message);
  }
}
