import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import CreationFormView from '../view/creation-form-view.js';
import { render } from '../render.js';

import { points } from '../mock/points.js';
import { destinations } from '../mock/destinations.js';
import { offers } from '../mock/offers.js';

export default class TripPresenter {
  filterComponent = new FilterView();
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor({ container }) {
    this.container = container;
    this.filterContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(this.filterComponent, this.filterContainer);
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    // пример одной формы редактирования
    const firstPoint = points[0];
    const firstDestination = destinations.find((d) => d.id === firstPoint.destination);
    const firstOffers = offers.filter((o) => firstPoint.offers.includes(o.id));

    render(
      new PointEditView(firstPoint, firstDestination, firstOffers),
      this.eventListComponent.getElement()
    );

    render(new CreationFormView(), this.eventListComponent.getElement());

    // рендер точек
    points.forEach((point) => {
      const destination = destinations.find((d) => d.id === point.destination);

      const pointOffers = offers.filter((offer) =>
        point.offers.includes(offer.id)
      );

      render(
        new PointView(point, destination, pointOffers),
        this.eventListComponent.getElement()
      );
    });
  }
}
