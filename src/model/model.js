import dayjs from 'dayjs';
import {
  adaptDestinationFromServer,
  adaptOffersFromServer,
  adaptPointFromServer,
  adaptPointToServer,
} from './adapters.js';
import { DEFAULT_FILTER, FILTER_TYPE_LIST, FilterLabel, FilterType } from '../const/filter-type.js';

function getFilterCount(points, type) {
  if (type === FilterType.EVERYTHING) {
    return points.length;
  }

  const now = dayjs();

  return points.filter((point) => {
    const pointDate = dayjs(point.dateFrom);

    if (type === FilterType.FUTURE) {
      return pointDate.isAfter(now, 'day');
    }

    if (type === FilterType.PRESENT) {
      return pointDate.isSame(now, 'day');
    }

    return pointDate.isBefore(now, 'day');
  }).length;
}

function getFilteredPoints(points, filter) {
  if (filter === FilterType.FUTURE) {
    return points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs(), 'day'));
  }

  if (filter === FilterType.PRESENT) {
    return points.filter((point) => dayjs(point.dateFrom).isSame(dayjs(), 'day'));
  }

  if (filter === FilterType.PAST) {
    return points.filter((point) => dayjs(point.dateFrom).isBefore(dayjs(), 'day'));
  }

  return points;
}

export default class Model {
  #apiService = null;

  constructor(apiService) {
    this.#apiService = apiService;
    this.pointTypes = [];
    this.destinations = [];
    this.offers = [];
    this.points = [];
  }

  async init() {
    const [points, destinations, offers] = await Promise.all([
      this.#apiService.getPoints(),
      this.#apiService.getDestinations().catch(() => []),
      this.#apiService.getOffers().catch(() => []),
    ]);

    this.points = points.map(adaptPointFromServer);
    this.destinations = destinations.map(adaptDestinationFromServer);
    this.offers = adaptOffersFromServer(offers);
    this.pointTypes = Array.from(new Set([
      ...this.points.map((point) => point.type),
      ...this.offers.map((offer) => offer.type),
    ]));
  }

  getPoints(filter = DEFAULT_FILTER) {
    return getFilteredPoints(this.points, filter);
  }

  getPointTypes() {
    return this.pointTypes;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }

  getFilters(activeFilter = DEFAULT_FILTER) {
    return FILTER_TYPE_LIST.map((type) => {
      const count = getFilterCount(this.points, type);

      return {
        type,
        label: FilterLabel[type],
        count,
        isChecked: type === activeFilter,
        isDisabled: count === 0,
      };
    });
  }

  getPointById(pointId) {
    return this.points.find((point) => point.id === pointId) ?? null;
  }

  setPoints(points) {
    this.points = points;
  }

  async updatePoint(updatedPoint) {
    const response = await this.#apiService.updatePoint(updatedPoint.id, adaptPointToServer(updatedPoint));
    const adaptedPoint = adaptPointFromServer(response);

    this.setPoints(this.points.map((point) => (point.id === adaptedPoint.id ? adaptedPoint : point)));

    return adaptedPoint;
  }

  async addPoint(newPoint) {
    const response = await this.#apiService.createPoint(adaptPointToServer({
      ...newPoint,
      id: undefined,
    }));
    const adaptedPoint = adaptPointFromServer(response);

    this.setPoints([adaptedPoint, ...this.points]);

    return adaptedPoint;
  }

  async deletePoint(pointId) {
    await this.#apiService.deletePoint(pointId);
    this.setPoints(this.points.filter((point) => point.id !== pointId));
  }

  getDestinationById(destinationId) {
    return this.destinations.find((destination) => destination.id === destinationId) ?? null;
  }

  getOffersByIds(offerIds) {
    return this.offers.filter((offer) => offerIds.includes(offer.id));
  }

  getOffersByType(type) {
    return this.offers.filter((offer) => offer.type === type);
  }
}
