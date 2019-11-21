/* global $ renderDatatable */

/* exported renderLockersPage */
function renderLockersPage($pageContainer, query, auth) {
  $pageContainer.html(`
    <p><a href="#home">Back to Home</a></p>

    <div class="datatable"></div>
  `);

  let locationMap = {};

  const definition = {
    columns: [
      {
        title: 'Action',
        className: 'excludeFromButtons',
        data: 'id',
        // orderable: false,
        render(data) {
          return `<a href="#lockers/${data}" class="btn btn-default">Open</a>`;
        },
        searchable: false,
        width: '57px'
      },
      {
        title: 'Location',
        data: 'location',
        type: 'string',
        choices: [{ text: '-- Select --', value: '' }],
        render(data) {
          return locationMap[data] || '-';
        }
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
        title: 'Status',
        data: '__Status',
        choices: [{ text: '-- Select --', value: '' }, { text: 'Active' }, { text: 'Inactive' }],
        width: '90px'
      }
    ],

    initComplete(settings, json) {
      if (json && json.data) {
        const filter = json.data
        .map((value) => value.location)
        .filter((value, index, array) => array.indexOf(value) === index)
        .map((value) => `id eq '${value}'`)
        .join(' or ');

      $.ajax(`/* @echo C3DATA_LOCATIONS */?$select=id,name&$filter=${filter}`, {
        headers: auth && auth.sId ? { Authorization: `AuthSession ${auth.sId}` } : {},
      }).then((response) => {
        locationMap = response.value.reduce((accumulator, value) => {
          accumulator[value.id] = value.name;
          return accumulator;
        }, {});
        this.dataTable().api().columns.adjust().draw();
      }, () => {
        console.log('error');
      });
      }
    },

    order: [[1, 'asc']]
  };

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCKERS */',

    newButtonLabel: 'New Locker',
    newButtonFragment: 'lockers/new',

    stateSaveWebStorageKey: 'lockers'
  });
}
