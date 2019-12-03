var common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function afterQuery(content, request, uriInfo, response) { }

function beforeContentParse(content, request, uriInfo, response) {
  var jsonContent = JSON.parse(content.toString());

  if (content.has('latest_inspection')) {
    content.remove('latest_inspection')
  }
  if (content.has('latest_inspection_date')) {
    content.remove('latest_inspection_date');
  }
  if (content.has('latest_inspection_result')) {
    content.remove('latest_inspection_result');
  }
  if (content.has('latest_inspection_notes')) {
    content.remove('latest_inspection_notes');
  }

  if (content.has('latest_note')) {
    content.remove('latest_note')
  }
  if (content.has('latest_note_date')) {
    content.remove('latest_note_date');
  }
  if (content.has('latest_note_note')) {
    content.remove('latest_note_note');
  }

  if (content.has('lockers_total')) {
    content.remove('lockers_total')
  }
  if (content.has('lockers_assigned')) {
    content.remove('lockers_assigned');
  }
  if (content.has('lockers_unassigned')) {
    content.remove('lockers_unassigned');
  }

  var lockersTotals = common.locations_getLockersTotals(jsonContent.id, {
    Authorization: request.getHeader('Authorization')
  });

  content.addProperty('lockers_total', lockersTotals.lockersTotal);
  content.addProperty('lockers_assigned', lockersTotals.lockersAssigned);
  content.addProperty('lockers_unassigned', lockersTotals.lockersUnassigned);

  if (jsonContent['__Status'] === '') {
    content.remove('__Status');
    content.addProperty('__Status', 'Active');
  }
}

// function afterCreate(content, request, uriInfo, response) { }

// function afterUpdate(content, request, uriInfo, response) { }

// function afterDelete(content, request, uriInfo, response) { }
