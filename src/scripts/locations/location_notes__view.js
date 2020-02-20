/* global locations__views locationNotesEntity__columns entity__columns */

/* exported location_notes__views */
const location_notes__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Notes',
    fragment: 'notes/all',

    definition(auth, opt, id) {
      return {
        columns: [
          entity__columns.action({ fragment: `${locations__views[opt].fragment}/${id}/${this.fragment}` }),

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
};
