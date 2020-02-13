/* global locationsEntity__columns */

/* exported locationsEntity__views */
const locationsEntity__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Locations',
    fragment: 'entities/locations/all',
    stateSaveWebStorageKey: 'entity_locations_all',

    definition(auth) {
      return {
        columns: Object.keys(locationsEntity__columns).map(
          (key) => typeof locationsEntity__columns[key] === 'function'
            ? locationsEntity__columns[key]({ auth, view: this })
            : locationsEntity__columns[key]
        ),

        order: [[1, 'asc']],

        searchCols: []
      };
    }
  }
};
