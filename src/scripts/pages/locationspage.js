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
        className: 'excludeFromButtons openButtonWidth',
        data: 'id',
        orderable: false,
        render(data) {
          return `<a href="#locations/${data}" class="btn btn-default">Open</a>`;
        },
        searchable: false
      },
      {
        title: 'Name',
        className: 'minWidth',
        data: 'name',
        type: 'string'
      },
      {
        title: 'Description',
        className: 'minWidth',
        data: 'description',
        type: 'string'
      },
      {
        title: 'Modified On',
        className: 'minWidth',
        data: '__ModifiedOn',
        type: 'date',
        render(data) {
          const dataMoment = moment(data);
          if (dataMoment.isValid()) {
            return dataMoment.format('YYYY/MM/DD');
          } else {
            return '-';
          }
        },
        width: '200px'
      },
      {
        title: 'Modified By',
        className: 'minWidth',
        data: '__Owner',
        type: 'string'
      },
      {
        title: 'Status',
        className: 'statusWidth',
        data: '__Status',
        type: 'string',
        searchType: 'equals',
        choices: [{ text: 'Active' }, { text: 'Inactive' }],
        render(data) {
          return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
        }
      }
    ],

    order: [[1, 'asc']]
  };

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCATIONS */',

    newButtonLabel: 'New Locker Location',
    newButtonFragment: 'locations/new',

    stateSaveWebStorageKey: 'locations',

    related: [
      {
        title: 'test',
        fragment: 'home',
        isCurrent: true
      }
    ]
  });
}
