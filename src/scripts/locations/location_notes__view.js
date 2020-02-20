/* global locationNotesEntity__columns entity__columns */

/* exported location_notes__views */
const location_notes__views = (parentView, id) => ({
  all: {
    breadcrumb: 'All',

    title: 'All Notes',
    fragment: `${parentView.fragment}/${id}/notes/all`,

    definition(auth) {
      return {
        columns: [
          entity__columns.action({ fragment: this.fragment }),

          locationNotesEntity__columns.date,
          locationNotesEntity__columns.note,

          entity__columns.__Status({ auth }),

          Object.assign({}, locationNotesEntity__columns.location, { visible: false }),
        ],

        order: [
          [1, 'desc']
        ],

        searchCols: [null, null, null, { search: 'Active' }, { search: id }]
      };
    }
  }
});

location_notes__views.active_view_key = 'all';
