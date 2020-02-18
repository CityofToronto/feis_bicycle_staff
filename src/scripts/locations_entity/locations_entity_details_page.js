/* global $ Backbone */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject renderAlert toSnapShot */
/* global renderForm */
/* global locationsEntity__views locationsEntity__fields */

/* exported locationsEntityDetailsPage */
function locationsEntityDetailsPage(app, $container, router, auth, opt, id, query) {

  // ---
  const ENTITY_VIEWS = locationsEntity__views;
  const ENTITY_VIEW = ENTITY_VIEWS[opt];
  const ENTITY_VIEW_DEFAULT = ENTITY_VIEWS.all;

  const REDIRECT_TO_DEFAULT = ENTITY_VIEW.title;
  const REDIRECT_TO_FRAGMENT_DEFAULT = ENTITY_VIEW.fragment;

  const ITEM = 'Locker Location';
  const ITEM_PLURAL = `${ITEM}s`;

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Entities', link: '#entities' },
    { name: ITEM_PLURAL, link: `#${ENTITY_VIEW_DEFAULT.fragment}` },
    { name: ENTITY_VIEW.breadcrumb, link: `#${ENTITY_VIEW.fragment}` }
  ];

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATIONS_URL */';

  const MODEL = Backbone.Model.extend({
    defaults: {
      municipality: 'Toronto',
      province: 'Ontario',
      __Status: 'Active'
    }
  });

  const COT_FORM_SECTIONS = [{
    title: 'Details',

    rows: [{
      fields: [
        Object.assign({}, locationsEntity__fields.site_name, { className: 'col-md-4' }),
        Object.assign({}, locationsEntity__fields.description, { className: 'col-md-8' })
      ]
    }, {
      fields: [
        Object.assign({}, locationsEntity__fields.civic_address, { className: 'col-md-8' })
      ]
    }, {
      fields: [
        locationsEntity__fields.municipality,
        locationsEntity__fields.province(auth),
        locationsEntity__fields.postal_code
      ]
    }]
  },
  {
    title: 'Contacts',

    rows: [{
      fields: [
        locationsEntity__fields.primary_contact_heading
      ]
    }, {
      fields: [
        Object.assign({}, locationsEntity__fields.primary_contact_first_name, { title: 'First Name', className: 'col-md-4' }),
        Object.assign({}, locationsEntity__fields.primary_contact_last_name, { title: 'Last Name', className: 'col-md-4' })
      ]
    }, {
      fields: [
        Object.assign({}, locationsEntity__fields.primary_contact_email, { title: 'Email' }),
        Object.assign({}, locationsEntity__fields.primary_contact_primary_phone, { title: 'Primary Phone' }),
        Object.assign({}, locationsEntity__fields.primary_contact_alternate_phone, { title: 'Alternate Phone' })
      ]
    }, {
      fields: [
        locationsEntity__fields.alternate_contact_heading
      ]
    }, {
      fields: [
        Object.assign({}, locationsEntity__fields.alternate_contact_first_name, { title: 'First Name', className: 'col-md-4' }),
        Object.assign({}, locationsEntity__fields.alternate_contact_last_name, { title: 'Last Name', className: 'col-md-4' })
      ]
    }, {
      fields: [
        Object.assign({}, locationsEntity__fields.alternate_contact_email, { title: 'Email' }),
        Object.assign({}, locationsEntity__fields.alternate_contact_primary_phone, { title: 'Primary Phone' }),
        Object.assign({}, locationsEntity__fields.alternate_contact_alternate_phone, { title: 'Alternate Phone' })
      ]
    }]
  }, {
    title: 'Latest Note',
    id: 'latest_note',
    postRender({ model, section }) {
      const $element = $(`#${section.id}`);
      model.on('init change:id', () => {
        if (model.isNew()) {
          $element.hide();
        } else {
          $element.show();
        }
      });
    },

    rows: [{
      fields: [
        Object.assign({}, locationsEntity__fields.latest_note__date, { title: 'Date', className: 'col-md-4' })
      ]
    }, {
      fields: [
        Object.assign({}, locationsEntity__fields.latest_note__note, { title: 'Note' })
      ]
    }]
  }, {
    title: 'Latest Inspection',
    id: 'latest_inspection',
    postRender({ model, section }) {
      const $element = $(`#${section.id}`);
      model.on('init change:id', () => {
        if (model.isNew()) {
          $element.hide();
        } else {
          $element.show();
        }
      });
    },

    rows: [
      {
        fields: [
          Object.assign({}, locationsEntity__fields.latest_inspection__date, { title: 'Date', className: 'col-md-4' }),
          Object.assign({}, locationsEntity__fields.latest_inspection__result, { title: 'Result', className: 'col-md-4' })
        ]
      },
      {
        fields: [
          Object.assign({}, locationsEntity__fields.latest_inspection__note, { title: 'Note' })
        ]
      }
    ]
  },
  {
    title: 'Meta',
    id: 'meta',
    postRender({ model, section }) {
      const $element = $(`#${section.id}`);
      model.on('init change:id', () => {
        if (model.isNew()) {
          $element.hide();
        } else {
          $element.show();
        }
      });
    },

    rows: [
      {
        fields: [
          Object.assign({}, locationsEntity__fields.id, { className: 'col-md-8' }),
          Object.assign({}, locationsEntity__fields.__Status(auth), { className: 'col-md-4' })
        ]
      },
      {
        fields: [
          locationsEntity__fields.__CreatedOn,
          locationsEntity__fields.__ModifiedOn,
          locationsEntity__fields.__Owner
        ]
      }
    ]
  }];
  // ---

  if (!(opt in ENTITY_VIEWS)) {
    return router.navigate(`${ENTITY_VIEW_DEFAULT.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
      // EXIT
    }

    const {
      redirectTo = REDIRECT_TO_DEFAULT,
      redirectToFragment = REDIRECT_TO_FRAGMENT_DEFAULT
    } = query__stringToObject(query);

    $container.empty();
    const $containerTop = $('<div></div>').appendTo($container);

    return Promise.resolve().then(() => {
      if (id !== 'new') {
        return ajaxes({
          beforeSend(jqXHR) {
            if (auth && auth.sId) {
              jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
            }
          },
          contentType: 'application/json; charset=utf-8',
          method: 'GET',
          url: `${DATAACCESS_URL}('${id}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const model = new MODEL(data);

      let snapShot = toSnapShot(model.toJSON());

      const definition = {
        successCore(data, options = {}) {
          const { auth, id, url } = options;

          return ajaxes({
            url: `${url}${id ? `('${id}')` : ''}`,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            method: id ? 'PUT' : 'POST',
            beforeSend(jqXHR) {
              if (auth && auth.sId) {
                jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
              }
            }
          }).then(({ data, textStatus, jqXHR }) => {
            snapShot = toSnapShot(data);

            router.navigate(`${ENTITY_VIEW.fragment}/${data.id}`, { trigger: false, replace: true });

            app.setBreadcrumb(BREADCRUMBS.concat({ name: data.site_name, link: `#${ENTITY_VIEW.fragment}/${data.id}` }), true);
            app.setTitle(data.site_name);

            return { data, textStatus, jqXHR };
          }).catch((error) => {
            console.error(error); // eslint-disable-line no-console
            throw error;
          });
        },

        sections: COT_FORM_SECTIONS,

        postRender: ({ model }) => {
          model.trigger('init');
        }
      };

      return Promise.resolve().then(() => {
        return renderForm($('<div></div>').appendTo($container), definition, model, {
          auth,
          url: DATAACCESS_URL,

          saveButtonLabel: (model) => model.isNew() ? `Create ${ITEM}` : `Update ${ITEM}`,

          cancelButtonLabel: 'Cancel',
          cancelButtonFragment: ENTITY_VIEW.fragment,

          removeButtonLabel: `Remove ${ITEM}`,
          removePromptValue: 'DELETE'
        });
      }).then(() => {
        $containerTop.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

        if (id === 'new') {
          app.setBreadcrumb(BREADCRUMBS.concat({ name: 'New', link: `#${ENTITY_VIEW.fragment}/new` }), true);
          app.setTitle(`New ${ITEM}`);
        } else {
          app.setBreadcrumb(BREADCRUMBS.concat({ name: data.site_name, link: `#${ENTITY_VIEW.fragment}/${data.id}` }), true);
          app.setTitle(data.site_name);
        }

        return () => {
          if (snapShot !== toSnapShot(model.toJSON())) {
            return modal__showConfirm('There may be one or more unsaved data. Do you want to continue?', {
              title: 'Confirm',
              confirmButtonLabel: 'Continue'
            });
          }
        };
      });
    }, (error) => {
      app.setBreadcrumb(BREADCRUMBS.concat({ name: 'Error' }), true);
      app.setTitle('An Error has Occured');

      renderAlert($container, '<p>An error occured while fetching data.</p>', {
        bootstrayType: 'danger',
        position: 'bottom'
      });

      throw error;
    });
  }).catch((error) => {
    console.error(error); // eslint-disable-line no-console
  });
}
