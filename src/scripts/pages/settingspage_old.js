/* global renderDatatable */

/* exported renderSettingsPage */
function renderSettingsPage($pageContainer, authConfig) {
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
          return `<a href="#settings/${data}" class="btn btn-default">Open</a>`;
        },
        searchable: false,
        width: '57px'
      },
      {
        title: 'Configuration',
        data: 'id',
        type: 'string'
      },
      {
        title: 'Modified On',
        data: '__ModifiedOn',
        type: 'date'
      },
      {
        title: 'Modified By',
        data: '__Owner',
        type: 'string'
      },
    ]
  };

  renderDatatable(
    $pageContainer.find('.datatable'),
    definition,
    '/* @echo C3DATA_SETTINGS */',
    {
      auth: authConfig.auth
    }
  );
}
