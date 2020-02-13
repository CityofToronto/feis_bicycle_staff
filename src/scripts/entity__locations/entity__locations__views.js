/* global entity__locations__columns */

/* exported entity__locations__views */
const entity__locations__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Locations',
    fragment: 'entities/locations/all',
    stateSaveWebStorageKey: 'entity_locations_all',

    definition(auth) { // eslint-disable-line no-unused-vars
      return {
        columns: Object.keys(entity__locations__columns).map(
          (key) => typeof entity__locations__columns[key] === 'function'
            ? entity__locations__columns[key]({ auth, view: this })
            : entity__locations__columns[key]
        ),

        order: [[1, 'asc']],

        searchCols: []
      };
    }
  }
};
