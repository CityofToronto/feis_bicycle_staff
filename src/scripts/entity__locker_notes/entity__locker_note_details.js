/* global $ moment */

/* exported entityLockerNoteDetails__fields */
const entityLockerNoteDetails__fields = {
  locker: (auth) => ({
    title: 'Locker',
    bindTo: 'locker',
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
      url: '/* @echo C3DATA_LOCKERS_URL */?$select=id,number&$filter=__Status eq \'Active\''
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.sort((a, b) => {
          const a_string = `${a.number}`.toLowerCase();
          const b_string = `${b.number}`.toLowerCase();
          if (a_string > b_string) {
            return 1;
          }
          if (a_string < b_string) {
            return -1;
          }
          return 0;
        }).map((item) => {
          return {
            text: `${item.number}`,
            value: item.id
          };
        });
      }
      return [];
    }
  }),

  date: {
    title: 'Date',
    bindTo: 'date',
    required: true,
    type: 'datetimepicker',
    options: {
      format: 'YYYY/MM/DD h:mm A'
    }
  },
  note: {
    title: 'Note',
    bindTo: 'note',
    type: 'textarea',
    rows: 10
  },

  id: (model) => ({
    title: 'ID',
    required: true,
    htmlAttr: { readonly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('id'));
      }
      model.on('change:id', handler);
      handler();
    }
  }),
  __Status: (auth, model) => ({
    title: 'Status',
    bindTo: '__Status',
    required: true,
    type: 'radio',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_STATUS_CHOICES */'
    },
    orientation: 'horizontal',
    postRender({ field }) {
      function handler() {
        $(`#${field.id}Element input[type="radio"][value="${model.get(field.bindTo)}"]`).prop('checked', true);
      }
      model.on('change:__Status', handler);
    }
  }),
  __CreatedOn: (model) => ({
    title: 'Created On',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ field }) {
      function handler() {
        const momentDate = moment(model.get('__CreatedOn'));
        if (momentDate.isValid()) {
          $(`#${field.id}`).val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $(`#${field.id}`).val('');
        }
      }
      model.on(`change:__CreatedOn`, handler);
      handler();
    }
  }),
  __ModifiedOn: (model) => ({
    title: 'Modified On',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ field }) {
      function handler() {
        const momentDate = moment(model.get('__ModifiedOn'));
        if (momentDate.isValid()) {
          $(`#${field.id}`).val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $(`#${field.id}`).val('');
        }
      }
      model.on(`change:__ModifiedOn`, handler);
      handler();
    }
  }),
  __Owner: (model) => ({
    title: 'Modified By',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ field }) {
      function handler() {
        $(`#${field.id}`).val(model.get('__Owner'));
      }
      model.on('change:__Owner', handler);
      handler();
    }
  })
};
