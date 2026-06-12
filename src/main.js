import Model from './model/model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './model/api-service.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import LoadingView from './view/loading-view.js';
import EmptyListView from './view/empty-list-view.js';
import { render } from './render.js';
import API_ENDPOINT from './const/api.js';
import { AUTH_TOKEN_RADIX, AUTH_TOKEN_SLICE_START } from './const/auth.js';

const LOAD_ERROR_MESSAGE = 'Failed to load latest route information';

const tripEventsContainer = document.querySelector('.trip-events');
const tripFiltersContainer = document.querySelector('.trip-controls__filters');
const authorization = Math.random().toString(AUTH_TOKEN_RADIX).slice(AUTH_TOKEN_SLICE_START);
const apiService = new ApiService(API_ENDPOINT, authorization);
const model = new Model(apiService);
const filterModel = new FilterModel();
const tripPresenterRef = {
  current: null,
};
render(new LoadingView(), tripEventsContainer);

model.init()
  .then(() => {
    tripEventsContainer.innerHTML = '';

    const filterPresenter = new FilterPresenter({
      container: tripFiltersContainer,
      model,
      filterModel,
      onFilterChange: () => tripPresenterRef.current.handleFilterChange(),
    });
    const tripPresenter = new TripPresenter({
      container: tripEventsContainer,
      model,
      filterModel,
      filterPresenter,
    });
    tripPresenterRef.current = tripPresenter;

    filterPresenter.init();
    tripPresenter.init();
  })
  .catch(() => {
    tripEventsContainer.innerHTML = '';
    render(new EmptyListView({ message: LOAD_ERROR_MESSAGE }), tripEventsContainer);
  });
