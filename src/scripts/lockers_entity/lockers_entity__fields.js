/* global $ moment */
/* global entity__fields */

/* exported lockersEntity__fields */
const lockersEntity__fields = {
  location: ({ auth }) => ({
    title: 'Locker Location',
    bindTo: 'location',
    required: true,
    type: 'dropdown',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATA_LOCATIONS_URL */?$select=id,site_name&$filter=__Status eq \'Active\'&$orderby=tolower(site_name)'
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.map((item) => {
          return {
            text: item.site_name,
            value: item.id
          };
        });
      }
      return [];
    }
  }),

  number: {
    title: 'Number',
    bindTo: 'number',
    required: true
  },
  description: {
    title: 'Description',
    bindTo: 'description',
    type: 'textarea'
  },

  latest_note__date: {
    title: 'Latest Note Date',
    type: 'text',
    required: false,
    htmlAttr: { readonly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on('init change:latest_note__date', () => {
        const momentDate = moment(model.get('latest_note__date'));
        if (momentDate.isValid()) {
          $element.val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $element.val('');
        }
      });
    }
  },
  latest_note__note: {
    title: 'Latest Note',
    type: 'textarea',
    rows: 5,
    required: false,
    htmlAttr: { readonly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on('init change:latest_note__note', () => {
        $element.val(model.get('latest_note__note'));
      });
    }
  },

  latest_inspection__date: {
    title: 'Latest Inspection Date',
    type: 'text',
    required: false,
    htmlAttr: { readonly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on('init change:latest_inspection__date', () => {
        const momentDate = moment(model.get('latest_inspection__date'));
        if (momentDate.isValid()) {
          $element.val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $element.val('');
        }
      });
    }
  },
  latest_inspection__result: {
    title: 'Latest Inspection Result',
    type: 'text',
    required: false,
    htmlAttr: { readonly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on('init change:latest_inspection__result', () => {
        $element.val(model.get('latest_inspection__result'));
      });
    }
  },
  latest_inspection__note: {
    title: 'Latest Inspection Note',
    type: 'textarea',
    rows: 5,
    htmlAttr: { readonly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on('change:latest_inspection__note', () => {
        $element.val(model.get('latest_inspection__note'));
      });
    }
  },

  id: entity__fields.id,
  __Status: entity__fields.__Status,
  __CreatedOn: entity__fields.__CreatedOn,
  __ModifiedOn: entity__fields.__ModifiedOn,
  __Owner: entity__fields.__Owner
};
