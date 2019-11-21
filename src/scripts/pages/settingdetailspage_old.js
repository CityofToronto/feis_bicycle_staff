/* global Backbone renderForm */

/* exported renderSettingDetailsPage */
function renderSettingDetailsPage($container, authConfig, id, dataChangeCbk) {
  $container.html(`
    <p><a href="#settings">Back to Settings</a></p>

    <div class="form"></div>
  `);

  let Model = Backbone.Model.extend({});

  let model = new Model({ id });

  const definition = {
    sections: [
      {
        title: 'Details',

        rows: [
          {
            fields: [
              {
                title: 'Name',
                bindTo: 'name',
                required: true
              },
              {
                title: 'Description',
                bindTo: 'description',
                type: 'text'
              }
            ]
          },
          {
            fields: [
              {
                title: 'Civic Address',
                bindTo: 'civic_address',
                type: 'text',
                required: true
              }
            ]
          },
          {
            fields: [
              {
                title: 'Municipality',
                bindTo: 'municipality',
                type: 'text',
                required: true
              },
              {
                title: 'Province',
                bindTo: 'province',
                type: 'dropdown',
                choices: '/* @echo C3DATAMEDIA_PROVINCE_CHOICES */',
                required: true
              },
              {
                title: 'Postal Code',
                bindTo: 'postal_code',
                type: 'text'
              }
            ]
          }
        ]
      }
    ],

    postRender({ model }) {
      model.trigger('change:type');
    }
  };

  return renderForm(
    $container.find('.form'),
    definition,
    model,
    '/* @echo C3DATA_LOCATIONS */',
    dataChangeCbk,
    {
      authConfig,

      includeMetaSection: true,
      metaSectionStatusChoices: '/* @echo C3DATAMEDIA_REGISTRATION_STATUS_CHOICES */',

      createButtonLabel: 'Create New Locker Location',
      updateButtonLabel: 'Save Locker Location',
      cancelButtonFragment: 'locations',
      removeButtonLabel: 'Remove Locker Location',
      removeButtonFragment: 'locations'
    }
  );
}
