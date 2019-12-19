/* global Backbone */
/* global auth__login auth__checkLogin deepCloneObject */
/* global renderAlert renderForm */

/* exported modal__showAlert */
function modal__showAlert(message, options = {}) {
  const { originatingElement = document.activeElement } = options;
  return new Promise((resolve) => {
    (window['cot_app'] || window['CotApp']).showModal({
      preset: 'alert',
      body: message,
      originatingElement,
      onHidden() {
        resolve();
      }
    });
  });
}

/* exported modal__showConfirm */
function modal__showConfirm(message, options = {}) {
  const {
    title = 'Confirm',

    cancelButtonLabel = 'Cancel',
    cancelButtonBootstrapType = 'default',
    confirmButtonLabel = 'Confirm',
    confirmButtonBootstrapType = 'default',

    originatingElement = document.activeElement
  } = options;

  return new Promise((resolve) => {
    let value = false;

    (window['cot_app'] || window['CotApp']).showModal({
      preset: 'confirm',
      title,
      body: message,
      buttons: {
        cancel: {
          label: cancelButtonLabel,
          bootstrapType: cancelButtonBootstrapType
        },
        confirm: {
          label: confirmButtonLabel,
          bootstrapType: confirmButtonBootstrapType
        }
      },
      callback() {
        value = true;
      },
      originatingElement,
      onHidden() {
        resolve(value);
      }
    });
  });
}

/* exported modal__showModalForm */
function modal__showModalForm(definition, model, options = {}) {
  const {
    title = 'Form',

    cancelButtonLabel = 'Cancel',
    cancelButtonBootstrapType = 'default',
    confirmButtonLabel = 'Confirm',
    confirmButtonBootstrapType = 'default',

    originatingElement = document.activeElement
  } = options;

  return new Promise((resolve) => {
    const $modalElement = (window['cot_app'] || window['CotApp']).showModal({
      preset: false,
      title,
      body: '',
      footerButtonsHtml: `
        <button class="btn btn-${cancelButtonBootstrapType} btn-cancel" type="button">${cancelButtonLabel}</button>
        <button class="btn btn-${confirmButtonBootstrapType} btn-confirm" type="button">${confirmButtonLabel}</button>
      `,
      originatingElement,
      onHidden() {
        resolve(model.toJSON());
      }
    });

    definition = deepCloneObject(definition);

    const originalSuccessCore = definition.successCore || function (data) {
      return Promise.resolve({ data });
    };

    definition.successCore = function (data, auth, url) {
      return originalSuccessCore.call(this, data, auth, url).then((data) => {
        $modalElement.modal('hide');
        return data;
      });
    };

    definition.id = definition.id || modal__showModalForm_genFormId();

    renderForm($modalElement.find('.modal-body'), definition, model,
      Object.assign({ includeMeta: false, saveButtonLabel: null }, options));

    $modalElement.find('.modal-footer .btn-cancel').on('click', () => {
      model.clear();
      $modalElement.modal('hide');
    });

    $modalElement.find('.modal-footer .btn-confirm').on('click', () => {
      $modalElement.find('.modal-body form.cot-form').submit();
    });
  });
}

let modal__showModalForm_idCounter = 0;
function modal__showModalForm_genFormId() {
  return `modelform_${modal__showModalForm_idCounter++}`;
}

/* exported modal__showPrompt */
function modal__showPrompt(message, defaultValue = '', options = {}) {
  const {
    title = 'Prompt',
    validators
  } = options;

  const definition = {
    sections: [
      {
        rows: [
          {
            fields: [
              {
                bindTo: 'value',
                required: true,
                requiredMessage: 'Required',
                title: message,
                validators: validators
              }
            ]
          }
        ]
      }
    ]
  };

  const model = new Backbone.Model({ value: defaultValue });
  return modal__showModalForm(definition, model, { title, saveMessage: null }).then((finalValue) => finalValue.value);
}

/* exported modal__showLogin */
function modal__showLogin(auth, options = {}) {
  const { userId } = auth;

  const model = new Backbone.Model({ user: userId });

  const definition = {
    successCore(data, options = {}) {
      const { $form, formValidator } = options;

      return auth__login(auth, model.get('user'), model.get('pwd')).catch(() => {
        formValidator.updateStatus('user', 'NOT_VALIDATED');
        formValidator.updateStatus('pwd', 'NOT_VALIDATED');

        renderAlert(
          $form.find('.panel-body'),
          '<strong>Login failed.</strong> Please review your user name and password and try again.',
          { bootstrayType: 'danger' }
        );
      });
    },

    sections: [
      {
        rows: [
          {
            fields: [
              {
                bindTo: 'user',
                required: true,
                title: 'User Name',
                type: 'text'
              }
            ]
          },
          {
            fields: [
              {
                bindTo: 'pwd',
                required: true,
                title: 'Password',
                type: 'password'
              }
            ]
          }
        ]
      }
    ]
  };

  const finalOptions = Object.assign({
    title: 'Login',
    confirmButtonLabel: 'Login',
    confirmButtonBootstrapType: 'primary',
    saveMessage: null
  }, options);

  return modal__showModalForm(definition, model, finalOptions).then(() => auth__checkLogin(auth));
}
