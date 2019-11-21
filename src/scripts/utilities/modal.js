/* global Backbone */
/* global auth_login auth_checkLogin deepCloneObject */
/* global renderAlert renderForm */

/* exported showAlert */
function showAlert(message) {
  return new Promise((resolve) => {
    (window['cot_app'] || window['CotApp']).showModal({
      preset: 'alert',
      body: message,
      originatingElement: document.activeElement,
      onHidden() {
        resolve();
      }
    });
  });
}

/* exported showConfirm */
function showConfirm(message, {
  title = 'Confirm',
  cancelButtonLabel = 'Cancel',
  cancelButtonBootstrapType = 'default',
  confirmButtonLabel = 'Confirm',
  confirmButtonBootstrapType = 'default'
} = {}) {
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
      originatingElement: document.activeElement,
      onHidden() {
        resolve(value);
      }
    });
  });
}

/* exported showModalForm */
function showModalForm(definition, options = {}) {
  options.model = options.model || new Backbone.Model(),
  options.includeMeta = options.includeMeta || false,
  options.saveButtonLabel = options.saveButtonLabel || null;

  const {
    title = 'Form',

    cancelButtonLabel = 'Cancel',
    cancelButtonBootstrapType = 'default',
    confirmButtonLabel = 'Confirm',
    confirmButtonBootstrapType = 'default',

    model
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
      originatingElement: document.activeElement,
      onHidden() {
        resolve(model.toJSON());
      }
    });

    definition = deepCloneObject(definition);
    definition.betterSuccess = definition.betterSuccess || (() => {
      $modalElement.modal('hide');
    });
    definition.id = definition.id || showModalForm.genFormId();

    renderForm($modalElement.find('.modal-body'), definition, options);

    $modalElement.find('.modal-footer .btn-cancel').on('click', () => {
      model.clear();
      $modalElement.modal('hide');
    });

    $modalElement.find('.modal-footer .btn-confirm').on('click', () => {
      $modalElement.find('.modal-body form.cot-form').submit();
    });
  });
}

showModalForm.genFormId = () => {
  if (!showModalForm.genFormId.idCounter) {
    showModalForm.genFormId.idCounter = 0;
  }
  return `modelform_${showModalForm.genFormId.idCounter++}`;
};

/* exported showPrompt */
function showPrompt(message, defaultValue = '', {
  title = 'Prompt',
  validators
} = {}) {
  const definition = {
    sections: [
      {
        rows: [
          {
            fields: [
              {
                title: message,
                bindTo: 'value',
                required: true,
                requiredMessage: 'Required',
                validators: validators
              }
            ]
          }
        ]
      }
    ]
  };

  return showModalForm(definition, {
    title,
    model: new Backbone.Model({ value: defaultValue }),
    saveMessage: null
  }).then((finalValue) => finalValue.value);
}

/* exported showLogin */
// TODO: Test function
function showLogin(authConfig, options = {}) {
  options.title = options.title || 'Login';
  options.confirmButtonLabel = options.confirmButtonLabel || 'Login';
  options.confirmButtonBootstrapType = options.confirmButtonBootstrapType || 'primary';

  const model = new Backbone.Model();

  const definition = {
    betterSuccess($modalElement, $form, model, $disabled) {
      auth_login(authConfig, authConfig.app || 'app', model.get('user'), model.get('pwd')).then(() => {
        $disabled.prop('disabled', false);
        $modalElement.modal('hide');
      }, () => {
        $disabled.prop('disabled', false);

        const validator = $form.data('formValidation');
        validator.updateStatus('user', 'NOT_VALIDATED');
        validator.updateStatus('pwd', 'NOT_VALIDATED');

        renderAlert(
          $form.find('.panel-body'),
          '<strong>Login failed.</strong> Please review your user name and password and try again.',
          renderAlert.positions.TOP,
          renderAlert.types.DANGER
        );
      });
    },

    sections: [
      {
        rows: [
          {
            fields: [
              {
                title: 'User Name',
                bindTo: 'user',
                required: true
              }
            ]
          },
          {
            fields: [
              {
                title: 'Password',
                type: 'password',
                bindTo: 'pwd',
                required: true
              }
            ]
          }
        ]
      }
    ]
  };

  return showModalForm(definition, model, options)
    .then(() => auth_checkLogin(authConfig));
}
