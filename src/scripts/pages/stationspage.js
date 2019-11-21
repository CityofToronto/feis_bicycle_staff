/* global renderDatatable */

/* exported renderStationsPage */
function renderStationsPage($pageContainer, query, auth) {
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
          return `<a href="#stations/${data}" class="btn btn-default">Open</a>`;
        },
        searchable: false,
        width: '57px'
      },
      {
        title: 'Name',
        data: 'name',
        type: 'string'
      },
      {
        title: 'Description',
        data: 'description',
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
    url: '/* @echo C3DATA_STATIONS */',

    newButtonLabel: 'New Station',
    newButtonFragment: 'stations/new',

    stateSaveWebStorageKey: 'stations'
  });
}
