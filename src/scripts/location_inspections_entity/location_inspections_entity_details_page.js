/* global $ Backbone */
/* global ajaxes auth__checkLogin modal__showConfirm query__objectToString query__stringToObject renderAlert toSnapShot */
/* global renderForm */
/* global locationInspectionsEntity__views entityLocationInspectionDetails__fields */

/* exported locatioInspectionsEntityDetailsPage */
function locatioInspectionsEntityDetailsPage(app, $container, router, auth, opt, id, query) {

  // ---
  const ENTITY_VIEWS = locationInspectionsEntity__views;
  const ENTITY_VIEW = ENTITY_VIEWS[opt];
  const ENTITY_VIEW_DEFAULT = ENTITY_VIEWS.all;

  const DEFAULT_REDIRECT_TO = ENTITY_VIEW.title;
  const DEFAULT_REDIRECT_TO_FRAGMENT = ENTITY_VIEW.fragment;

  const ITEM = 'Locker Location Inspection';
  const ITEM_PLURAL = `${ITEM}s`;

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Entities', link: '#entities' },
    { name: ITEM_PLURAL, link: `#${ENTITY_VIEW_DEFAULT.fragment}` },
    { name: ENTITY_VIEW.breadcrumb, link: `#${ENTITY_VIEW.fragment}` }
  ];

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */';

  const MODEL = Backbone.Model.extend({
    defaults: {
      municipality: 'Toronto',
      province: 'Ontario',
      __Status: 'Active'
    }
  });

  const COT_FORM_SECTIONS = [
    {
      title: 'Details',

      rows: [
        {
          fields: [
            entityLocationInspectionDetails__fields.location({ auth }),
            entityLocationInspectionDetails__fields.date,
            entityLocationInspectionDetails__fields.result({ auth })
          ]
        },
        {
          fields: [
            entityLocationInspectionDetails__fields.note
          ]
        }
      ]
    },
    {
      title: 'Details',
      id: 'details',
      postRender({ model, section }) {
        function handler() {
          if (model.isNew()) {
            $(`#${section.id}`).hide();
          } else {
            $(`#${section.id}`).show();
          }
        }
        handler();
        model.on(`change:${model.idAttribute}`, handler);
      },

      rows: [
        {
          fields: [
            Object.assign({}, entityLocationInspectionDetails__fields.id, { className: 'col-md-8' }),
            Object.assign({}, entityLocationInspectionDetails__fields.__Status({ auth }), { className: 'col-md-4' })
          ]
        },
        {
          fields: [
            entityLocationInspectionDetails__fields.__CreatedOn,
            entityLocationInspectionDetails__fields.__ModifiedOn,
            entityLocationInspectionDetails__fields.__Owner
          ]
        }
      ]
    }
  ];
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
      redirectTo = DEFAULT_REDIRECT_TO,
      redirectToFragment = DEFAULT_REDIRECT_TO_FRAGMENT
    } = query__stringToObject(query);

    $container.empty();

    // ADD REDIRECT
    $container.append(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

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

      // ADD COT FORM
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

        // SET TITLE AND BREADCRUMB
        if (id === 'new') {
          app.setBreadcrumb(BREADCRUMBS.concat({ name: 'New', link: `#${ENTITY_VIEW.fragment}/new` }), true);
          app.setTitle(`New ${ITEM}`);
        } else {
          app.setBreadcrumb(BREADCRUMBS.concat({ name: data.site_name, link: `#${ENTITY_VIEW.fragment}/${data.id}` }), true);
          app.setTitle(data.site_name);
        }

        // RETURN CLEANUP FUNCTION
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

      // SET TITLE AND BREADCRUMB
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
