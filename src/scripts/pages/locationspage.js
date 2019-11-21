/* global moment */
/* global renderDatatable */

/* exported renderLocationsPage */
function renderLocationsPage($pageContainer, query, auth) {
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
          return `<a href="#locations/${data}" class="btn btn-default">Open</a>`;
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
        title: 'Modified On',
        data: '__ModifiedOn',
        type: 'date',
        width: 150,
        render(data) {
          const dataMoment = moment(data);
          if (dataMoment.isValid()) {
            return dataMoment.format('YYYY/MM/DD ha');
          } else {
            return '-';
          }

        }
      },
      {
        title: 'Modified By',
        data: '__Owner',
        width: 150
      }
    ],

    order: [[1, 'asc']]
  };

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCATIONS */',

    newButtonLabel: 'New Locker Location',
    newButtonFragment: 'locations/new',

    stateSaveWebStorageKey: 'locations'
  });
}
