/* global locationInspectionsEntity__columns entity__columns */

/* exported location_inspections__views */
const location_inspections__views = (parentView, id) => ({
  all: {
    breadcrumb: 'All',

    title: 'All Inspection',
    fragment: `${parentView.fragment}/${id}/inspections/all`,

    definition(auth) {
      return {
        columns: [
          entity__columns.action({ fragment: this.fragment }),

          locationInspectionsEntity__columns.date,
          locationInspectionsEntity__columns.result({ auth }),
          locationInspectionsEntity__columns.note,

          entity__columns.__Status({ auth }),

          Object.assign({}, locationInspectionsEntity__columns.location, { visible: false }),
        ],

        order: [
          [1, 'desc']
        ],

        searchCols: [null, null, null, null, { search: 'Active' }, { search: id }]
      };
    }
  }
});

location_inspections__views.active_view_key = 'all';
