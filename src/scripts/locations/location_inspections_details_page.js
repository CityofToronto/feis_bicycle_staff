/* global $ Backbone moment */
/* global ajaxes auth__checkLogin fixButtonLinks modal__showConfirm query__objectToString query__stringToObject
  renderAlert toSnapShot */
/* global renderForm */
/* global locations__views location_notes__views location_inspections__views entityLocationInspectionDetails__fields */

/* exported locationInspectionsDetailsPage */
function locationInspectionsDetailsPage(app, $container, router, auth, opt1, id1, opt2, id2, query) {

  // ---
  const PARENT_VIEWS = locations__views;

  const PARENT_VIEW__DEFAULT = PARENT_VIEWS.all;
  const PARENT_VIEW__CURRENT = PARENT_VIEWS[opt1];

  const VIEWS = location_inspections__views(PARENT_VIEW__CURRENT, id1);

  const VIEW__DEFAULT = VIEWS.all;
  const VIEW__CURRENT = VIEWS[opt2];

  const DEFAULT_REDIRECT = PARENT_VIEW__CURRENT.title;
  const DEFAULT_REDIRECT_FRAGMENT = PARENT_VIEW__CURRENT.fragment;

  const TITLE__FUNC = function (data) {
    return data.site_name;
  };

  const BREADCRUMBS = [
    { name: app.name, link: '#home' },
    { name: 'Locker Locations', link: `#${PARENT_VIEW__DEFAULT.fragment}` },
    { name: PARENT_VIEW__CURRENT.breadcrumb, link: `#${PARENT_VIEW__CURRENT.fragment}` }
  ];
  const BREADCRUMBS__FUNC = (data) => BREADCRUMBS.concat({
    name: data.site_name,
    link: `#${VIEW__CURRENT.fragment}/${data.id}`
  });

  const ITEM = 'Location Inspection';

  const DATAACCESS_URL = '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */';
  const DATAACCESS_URL__PARENT = '/* @echo C3DATA_LOCATIONS_URL */';

  const TABS = `
    <div class="navbar">
      <ul class="nav nav-tabs">
      <li class="nav-item" role="presentation">
        <a href="#${PARENT_VIEW__CURRENT.fragment}/${id1}" class="nav-link">Location</a>
      </li>
      <li class="nav-item" role="presentation">
        <a href="#${location_notes__views(PARENT_VIEW__CURRENT, id1)[location_notes__views.active_view_key].fragment}" class="nav-link">Notes</a>
      </li>
      <li class="nav-item active" role="presentation">
        <a href="#${VIEW__CURRENT.fragment}" class="nav-link">Inspections</a>
      </li>
      </ul>
    </div>
  `;

  const MODEL = Backbone.Model.extend({
    defaults: {
      location: id1,
      result: 'OK',
      date: new Date(),
      __Status: 'Active'
    }
  });

  const COT_FORM_SECTIONS = [
    {
      title: 'Details',

      rows: [
        {
          fields: [
            Object.assign({}, entityLocationInspectionDetails__fields.date, { className: 'col-md-4' }),
            Object.assign({}, entityLocationInspectionDetails__fields.result({ auth }), { className: 'col-md-4' })
          ]
        },
        {
          fields: [
            entityLocationInspectionDetails__fields.note
          ]
        }
      ]
    }
  ];

  const FINALIZE_DATA = (data) => {
    const momentDate = moment(data.date, 'YYYY/MM/DD h:mm A');
    if (momentDate.isValid()) {
      data.date = momentDate.format();
    }
  };
  // ---

  if (!(opt1 in PARENT_VIEWS)) {
    return router.navigate(`${PARENT_VIEW__DEFAULT.fragment}/${id1}/${VIEW__DEFAULT.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  if (!(opt2 in VIEWS)) {
    return router.navigate(`${VIEW__DEFAULT.fragment}?${query__objectToString({ resetState: 'yes' })}`,
      { trigger: true, replace: true });
    // EXIT
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
      // EXIT
    }

    const {
      redirectTo = DEFAULT_REDIRECT,
      redirectToFragment = DEFAULT_REDIRECT_FRAGMENT,
    } = query__stringToObject(query);

    $container.empty();

    // SET TITLE AND BREADCRUMB
    ajaxes({
      beforeSend(jqXHR) {
        if (auth && auth.sId) {
          jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
        }
      },
      contentType: 'application/json; charset=utf-8',
      method: 'GET',
      url: `${DATAACCESS_URL__PARENT}('${id1}')`
    }).then(({ data }) => {
      app.setBreadcrumb(BREADCRUMBS__FUNC(data), true);
      app.setTitle(TITLE__FUNC(data));
    });

    // ADD REDIRECT
    $container.append(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    // ADD TABS REGION
    const $tabContainer = $('<div></div>').appendTo($container);
    $tabContainer.html(TABS);
    fixButtonLinks($tabContainer);

    return Promise.resolve().then(() => {
      if (id2 !== 'new') {
        return ajaxes({
          beforeSend(jqXHR) {
            if (auth && auth.sId) {
              jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
            }
          },
          contentType: 'application/json; charset=utf-8',
          method: 'GET',
          url: `${DATAACCESS_URL}('${id2}')`
        });
      }

      return { data: {} };
    }).then(({ data }) => {
      const model = new MODEL(data);

      let snapShot = toSnapShot(model.toJSON());

      const definition = {
        successCore(data, options = {}) {
          const { auth, id, url } = options;

          FINALIZE_DATA(data);

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

            router.navigate(`${VIEW__CURRENT.fragment}/${data.id}`, { trigger: false, replace: true });

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
          cancelButtonFragment: VIEW__CURRENT.fragment,

          removeButtonLabel: `Remove ${ITEM}`,
          removePromptValue: 'DELETE'
        });
      }).then(() => {

        // SET TITLE AND BREADCRUMB
        // app.setBreadcrumb(BREADCRUMBS__FUNC(model.toJSON()), true);
        // app.setTitle(TITLE__FUNC(model.toJSON()));
        // model.on('change:id', () => {
        //   app.setBreadcrumb(BREADCRUMBS__FUNC(model.toJSON()), true);
        //   app.setTitle(TITLE__FUNC(model.toJSON()));
        // });

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
