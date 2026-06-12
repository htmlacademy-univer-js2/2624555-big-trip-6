const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const FilterLabel = {
  [FilterType.EVERYTHING]: 'Everything',
  [FilterType.FUTURE]: 'Future',
  [FilterType.PRESENT]: 'Present',
  [FilterType.PAST]: 'Past',
};

const DEFAULT_FILTER = FilterType.EVERYTHING;

const FILTER_TYPE_LIST = [
  FilterType.EVERYTHING,
  FilterType.FUTURE,
  FilterType.PRESENT,
  FilterType.PAST,
];

export { DEFAULT_FILTER, FILTER_TYPE_LIST, FilterLabel, FilterType };
