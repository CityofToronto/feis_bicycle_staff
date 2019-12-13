/* global moment */
/* global query__objectToString query__stringToObject */
/* global renderDatatable */
/* global locationsPage__defaultOpt */

const locationInspectionsPage__defaultOpt2 = 'all';

let locationInspectionsPage__lastOpt;
let locationInspectionsPage__lastOpt2;

const locationInspectionsPage__stateSaveWebStorageKey = 'locationInspections';

const locationInspectionsPage__columns = {
  action: {
    title: 'Action',
    className: 'excludeFromButtons openButtonWidth',
    data: 'id',
    orderable: false,
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
        return '';
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
        return '';
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

/* exported locationInspectionsPage__render */
function locationInspectionsPage__render($pageContainer, opt, id, opt2, query, auth) {
  opt = opt || locationsPage__defaultOpt;
  opt2 = opt2 || locationInspectionsPage__defaultOpt2;

  const { resetState } = query__stringToObject(query);
  if (locationInspectionsPage__lastOpt !== opt || locationInspectionsPage__lastOpt2 !== opt2 || resetState === 'yes') {
    sessionStorage.removeItem(locationInspectionsPage__stateSaveWebStorageKey);
    locationInspectionsPage__lastOpt = opt;
    locationInspectionsPage__lastOpt2 = opt2;
  }

  $pageContainer.html(`
    <p><a href="#locations/${opt}">Back to Locker Locations</a></p>

    <div class="navbar">
      <ul class="nav nav-tabs">
        <li class="nav-item" role="presentation">
          <a href="#locations/${opt}/${id}" class="nav-link">Location</a>
        </li>

        <li class="nav-item active" role="presentation">
          <a href="#locations/${opt}/${id}/inspections/${locationInspectionsPage__lastOpt2 || locationInspectionsPage__defaultOpt2}" class="nav-link">Inspections</a>
        </li>
      </ul>
    </div>

    <div class="datatable"></div>
  `);

  const definition = {
    columns: [],
    order: [],
    searchCols: []
  };

  const related = [
    {
      title: 'All',
      fragment: `locations/${opt}/${id}/inspections/all?${query__objectToString({ resetState: 'yes' })}`
    }
  ];

  switch (opt) {
    default:
      definition.columns.push(
        Object.assign({}, locationInspectionsPage__columns.action, {
          render(data) {
            return `<a href="#locations/${opt}/${id}/inspections/${opt2}/${data}?${query__objectToString({ resetState: 'yes' })}" class="btn btn-default dblclick-target">Open</a>`;
          }
        }),

        locationInspectionsPage__columns.date,
        locationInspectionsPage__columns.result,
        locationInspectionsPage__columns.notes,

        locationInspectionsPage__columns.__CreatedOn,
        locationInspectionsPage__columns.__ModifiedOn,
        locationInspectionsPage__columns.__Owner,
        locationInspectionsPage__columns.__Status,

        locationInspectionsPage__columns.location
      );

      definition.order.push([1, 'asc']);

      definition.searchCols[definition.columns.length - 2] = { search: 'Active' };
      definition.searchCols[definition.columns.length - 1] = { search: id };

      related[0].isCurrent = true;
  }

  renderDatatable($pageContainer.find('.datatable'), definition, {
    auth,
    url: '/* @echo C3DATA_LOCATION_INSPECTIONS */',

    newButtonLabel: 'New Locker Location Inspection',
    newButtonFragment: `locations/${opt}/${id}/inspections/${opt2}/new`,

    stateSaveWebStorageKey: locationInspectionsPage__stateSaveWebStorageKey,

    related
  });
}
