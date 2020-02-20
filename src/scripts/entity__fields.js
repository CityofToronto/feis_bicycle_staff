/* global $ moment */

/* exported entity__fields */
const entity__fields = {
  id: {
    title: 'ID',
    type: 'text',
    required: true,
    htmlAttr: { readonly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on('init change:id', () => {
        $element.val(model.get('id'));
      });
    }
  },

  __Status: ({ auth }) => ({
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
    bindTo: '__Status'
  }),

  __CreatedOn: {
    title: 'Created On',
    type: 'text',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on(`init change:__CreatedOn`, () => {
        const momentDate = moment(model.get('__CreatedOn'));
        if (momentDate.isValid()) {
          $element.val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $element.val('');
        }
      });
    }
  },

  __ModifiedOn: {
    title: 'Modified On',
    type: 'text',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on(`init change:__ModifiedOn`, () => {
        const momentDate = moment(model.get('__ModifiedOn'));
        if (momentDate.isValid()) {
          $element.val(momentDate.format('YYYY/MM/DD h:mm A'));
        } else {
          $element.val('');
        }
      });
    }
  },

  __Owner: {
    title: 'Modified By',
    type: 'text',
    required: true,
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`#${field.id}`);
      model.on('init change:__Owner', () => {
        $element.val(model.get('__Owner'));
      });
    }
  }
};
