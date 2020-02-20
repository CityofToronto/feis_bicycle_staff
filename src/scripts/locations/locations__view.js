/* global locationsEntity__columns entity__columns */

/* exported locations__views */
const locations__views = {
  all: {
    breadcrumb: 'All',
    title: 'All Locker Locations',
    fragment: `locations/all`,

    definition(auth) {
      return {
        columns: [
          entity__columns.action({ fragment: this.fragment }),

          locationsEntity__columns.site_name,
          locationsEntity__columns.address,

          locationsEntity__columns.lockers_total,

          locationsEntity__columns.contact,
          locationsEntity__columns.phone,

          entity__columns.__Status({ auth })
        ],

        order: [[1, 'asc']],

        searchCols: [null, null, null, null, null, null, { search: 'Active' }]
      };
    }
  },

  upforinspection: {
    breadcrumb: 'Up for Inspection',
    title: 'Up for Inspection',
    fragment: `locations/upforinspection`,

    definition(auth) {
      return {
        columns: [
          entity__columns.action({ fragment: this.fragment }),

          locationsEntity__columns.latest_inspection__date,
          locationsEntity__columns.latest_inspection__result({ auth }),

          locationsEntity__columns.site_name,
          locationsEntity__columns.address,

          locationsEntity__columns.lockers_total,

          locationsEntity__columns.contact,
          locationsEntity__columns.phone,

          entity__columns.__Status({ auth })
        ],

        order: [[1, 'desc']],

        searchCols: [null, null, null, null, null, null, null, null, { search: 'Active' }]
      };
    }
  }
};
