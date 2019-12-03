var common = require('bicycle_parking/common.js');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function afterQuery(content, request, uriInfo, response) { }

function beforeContentParse(content, request, uriInfo, response) {
  if (!content.has('lockers_total')) {
    content.addProperty('lockers_total', 0);
  }

  if (!content.has('lockers_assigned')) {
    content.addProperty('lockers_assigned', 0);
  }

  if (!content.has('lockers_unassigned')) {
    content.addProperty('lockers_unassigned', 0);
  }

  if (!content.has('__Status') || content.get('__Status').getAsString() === '') {
    if (content.has('__Status')) {
      content.remove('__Status');
    }
    content.addProperty('__Status', 'Active');
  }
}

// function afterCreate(content, request, uriInfo, response) { }

// function afterUpdate(content, request, uriInfo, response) { }

// function afterDelete(content, request, uriInfo, response) { }
