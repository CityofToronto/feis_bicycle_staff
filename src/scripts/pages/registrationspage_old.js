/* global renderDatatable */

/* exported renderRegistrationsPage */
function renderRegistrationsPage($pageContainer, auth) {
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
          return `<a href="#registrations/${data}" class="btn btn-default">Open</a>`;
        },
        searchable: false,
        width: '57px'
      },
      {
        title: 'Submitted On',
        data: '__CreatedOn',
        type: 'date'
      },
      {
        title: 'First Name',
        data: 'first_name',
        type: 'string'
      },
      {
        title: 'Last Name',
        data: 'last_name',
        type: 'string'
      },
      {
        title: 'Status',
        data: '__Status',
        choices: [{ text: '-- Select --', value: '' }, { text: 'Active' }, { text: 'Inactive' }],
        width: '90px'
      }
    ]
  };

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_REGISTRATIONS */',

    newButtonLabel: 'New Registration',
    newButtonFragment: 'registrations/new',

    stateSaveWebStorageKey: 'registrations'
  });
}
