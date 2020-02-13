/* global $ moment */

/* exported entity__fields */
const entity__fields = {
  id: ({ model }) => ({
    title: 'ID',
    type: 'text',
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

  __Status: ({ auth, model }) => ({
    title: 'Status',
    type: 'radio',
    choices: {
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: '/* @echo C3DATAMEDIA_STATUS_CHOICES */',
      webStorage: sessionStorage
    },
    orientation: 'horizontal',
    required: true,
    bindTo: '__Status',
    postRender({ field }) {
      function handler() {
        $(`#${field.id}Element input[type="radio"][value="${model.get(field.bindTo)}"]`).prop('checked', true);
      }
      model.on('change:__Status', handler);
    }
  }),

  __CreatedOn: ({ model }) => ({
    title: 'Created On',
    type: 'text',
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

  __ModifiedOn: ({ model }) => ({
    title: 'Modified On',
    type: 'text',
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

  __Owner: ({ model }) => ({
    title: 'Modified By',
    type: 'text',
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
