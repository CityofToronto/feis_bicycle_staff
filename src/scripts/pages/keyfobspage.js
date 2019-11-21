/* global renderDatatable */

/* exported renderKeyfobsPage */
function renderKeyfobsPage($pageContainer, query, auth) {
  $pageContainer.html(`
    <p><a href="#home">Back to Home</a></p>

    <div class="datatable"></div>
  `);

  const definition = {
    columns: [
      {
        title: 'Action',
        className: 'excludeFromButtons',
        data: 'id',
        // orderable: false,
        render(data) {
          return `<a href="#keyfobs/${data}" class="btn btn-default">Open</a>`;
        },
        searchable: false,
        width: '57px'
      },
      {
        title: 'Number',
        data: 'number',
        type: 'string'
      },
      {
        title: 'Description',
        data: 'description',
        type: 'string'
      },
      {
        title: 'Stations',
        data: 'stations',
        type: 'string'
      },
      {
        title: 'Status',
        data: '__Status',
        choices: [{ text: '-- Select --', value: '' }, { text: 'Active' }, { text: 'Inactive' }],
        width: '90px'
      }
    ],

    order: [[1, 'asc']]
  };

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_KEYFOBS */',

    newButtonLabel: 'New Station Key Fobs',
    newButtonFragment: 'keyfobs/new',

    stateSaveWebStorageKey: 'keyfobs'
  });
}
