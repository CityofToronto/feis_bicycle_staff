/* global moment */
/* global query__objectToString query__stringToObject */
/* global renderDatatable */

/* exported renderLocationInspectionsPage */
function renderLocationInspectionsPage($pageContainer, location, query, auth) {
  const { locations, inspections, lockers } = query__stringToObject(query);

  if (renderLocationInspectionsPage.lastLocation != location || renderLocationInspectionsPage.lastInspections != inspections) {
    clearLocationInspectionsState();
    renderLocationInspectionsPage.lastLocation = location;
    renderLocationInspectionsPage.lastInspections = inspections;
  }

  const navQuery = query__objectToString({ locations, inspections, lockers });
  $pageContainer.html(`
    <p><a href="#locations?${query__objectToString({ locations })}">Back to Locker Locations</a></p>

    <div class="navbar">
      <ul class="nav nav-tabs">
        <li class="nav-item" role="presentation">
          <a href="#locations/${location}?${navQuery}" class="nav-link">Location</a>
        </li>

        <li class="nav-item active" role="presentation">
          <a href="#locations/${location}/inspections?${navQuery}" class="nav-link">Inspections</a>
        </li>

        <li class="nav-item" role="presentation">
          <a class="nav-link">Lockers</a>
        </li>
      </ul>
    </div>

    <div class=datatable></div>
  `);

  const columns = {
    action: {
      title: 'Action',
      className: 'excludeFromButtons openButtonWidth',
      data: 'id',
      orderable: false,
      render(data) {
        return `<a href=#locations/${location}/inspections/${data}?${query__objectToString({ locations, inspections, lockers, resetState: 'yes' })} class="btn btn-default">Open</a>`;
      },
      searchable: false
    },

    date: {
      title: 'Date',
      className: 'minWidth',
      data: 'date',
      type: 'date',
      render(data) {
        const dataMoment = moment(data);
        if (dataMoment.isValid()) {
          return dataMoment.format('YYYY/MM/DD');
        } else {
          return '';
        }
      }
    },
    result: {
      title: 'Result',
      className: 'minWidth',
      data: 'result',
      type: 'string',
      searchType: 'equals',
      choices: '/* @echo C3DATAMEDIA_INSPECTION_RESULT_CHOICES */',
      render(data) {
        return `<span class="label label-${data === 'OK' ? 'success' : data === 'Problem' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
      }
    },
    notes: {
      title: 'Notes',
      className: 'minWidth',
      data: 'notes',
      type: 'string'
    },

    __CreatedOn: {
      title: 'Created On',
      className: 'minWidth',
      data: '__CreatedOn',
      type: 'date',
      render(data) {
        const dataMoment = moment(data);
        if (dataMoment.isValid()) {
          return dataMoment.format('YYYY/MM/DD');
        } else {
          return '-';
        }
      }
    },
    __ModifiedOn: {
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
      }
    },
    __Owner: {
      title: 'Modified By',
      className: 'minWidth',
      data: '__Owner',
      type: 'string'
    },
    __Status: {
      title: 'Status',
      className: 'statusWidth',
      data: '__Status',
      type: 'string',
      searchType: 'equals',
      choices: [{ text: 'Active' }, { text: 'Inactive' }],
      render(data) {
        return `<span class="label label-${data === 'Active' ? 'success' : data === 'Inactive' ? 'danger' : 'default'}" style="font-size: 90%;">${data}</span>`;
      }
    },

    location: {
      title: 'Location',
      className: 'minWidth',
      data: 'location',
      type: 'string',
      searchType: 'equals',
      visible: false
    }
  };

  const definition = {
    columns: [],
    order: [],
    searchCols: []
  };

  const related = [
    {
      title: 'All',
      fragment: `locations/${location}/inspections?${query__objectToString({ locations, inspections: 'all', lockers, resetState: 'yes' })}`
    }
  ];

  switch (inspections) {
    default:
      definition.columns.push(
        columns.action,

        columns.date,
        columns.result,
        columns.notes,

        columns.__CreatedOn,
        columns.__ModifiedOn,
        columns.__Owner,
        columns.__Status,

        columns.location
      );

      definition.order.push([1, 'desc']);

      definition.searchCols[definition.columns.length - 2] = { search: 'Active' };
      definition.searchCols[definition.columns.length - 1] = { search: location };

      related[0].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCATION_INSPECTIONS */',

    newButtonLabel: 'New Inspection',
    newButtonFragment: `locations/${location}/inspections/new?${query__objectToString({ locations, inspections, lockers, resetState: 'yes' })}`,

    stateSaveWebStorageKey: `locationinspections`,

    related
  });
}

/* exported clearLocationInspectionsState */
function clearLocationInspectionsState() {
  sessionStorage.removeItem('locationinspections');
}
