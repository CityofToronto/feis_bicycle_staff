/* global $ */
/* global ajaxes auth__checkLogin fixButtonLinks query__objectToString query__stringToObject
   renderAlert */
/* global renderDatatable */
/* global entityLocationInspections__columns page__locations__views renderLocationDetailsNotesPage__resetState
   renderLocationDetailsNotesPage__currentView */

const renderLocationDetailsInspectionsPage__views = {
  all: {
    breadcrumb: 'All',

    title: 'All Inspections',
    fragment: (opt, id) => `${page__locations__views[opt].fragment}/${id}/inspections/all`,

    definition: (auth, opt, id) => {
      const definition = {
        columns: [
          entityLocationInspections__columns.action(renderLocationDetailsInspectionsPage__views.all.fragment(opt, id)),

          entityLocationInspections__columns.date,
          entityLocationInspections__columns.result(auth),
          entityLocationInspections__columns.note,

          entityLocationInspections__columns.__Status(auth),

          Object.assign({}, entityLocationInspections__columns.location, { visible: false }),
        ],

        order: [
          [1, 'desc']
        ],

        searchCols: []
      };

      definition.searchCols[definition.columns.length - 2] = { search: 'Active' };
      definition.searchCols[definition.columns.length - 1] = { search: id };

      return definition;
    }
  }
};

let renderLocationDetailsInspectionsPage__currentView = 'all';

/* exported renderLocationDetailsInspectionsPage__resetState */
function renderLocationDetailsInspectionsPage__resetState(opt1, id1) {
  const stateSaveWebStorageKey = `locations_${opt1}_${id1}_inspections_${renderLocationDetailsInspectionsPage__currentView}`;
  sessionStorage.removeItem(stateSaveWebStorageKey);
}

/* exported renderLocationDetailsInspectionsPage */
function renderLocationDetailsInspectionsPage(app, $container, router, auth, opt1, id1, opt2, query) {
  if (!(opt1 in page__locations__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${page__locations__views.all.fragment}/${id1}/${opt2}?${query}`, { trigger: true, replace: true });
    return;
  }

  if (!(opt2 in renderLocationDetailsInspectionsPage__views)) {
    const query = query__objectToString({ resetState: 'yes' });
    router.navigate(`${renderLocationDetailsInspectionsPage__views.all.fragment(opt1, id1)}?${query}`, { trigger: true, replace: true });
    return;
  }

  return auth__checkLogin(auth).then((isLoggedIn) => {
    if (!isLoggedIn) {
      return router.navigateToLoginPage();
    }

    const {
      redirectTo = 'Locations',
      redirectToFragment = page__locations__views.all.fragment,
      resetState
    } = query__stringToObject(query);

    $container.html(`<p><a href="#${redirectToFragment}">Back to ${redirectTo}</a></p>`);

    const $tabContainer = $('<div></div>').appendTo($container);
    $tabContainer.html(`
      <div class="navbar">
        <ul class="nav nav-tabs">
          <li class="nav-item" role="presentation">
            <a href="#${page__locations__views[opt1].fragment}/${id1}" class="nav-link">Location</a>
          </li>

          <li class="nav-item" role="presentation">
            <a href="#${page__locations__views[opt1].fragment}/${id1}/notes/${renderLocationDetailsNotesPage__currentView}" class="nav-link">Notes</a>
          </li>

          <li class="nav-item active" role="presentation">
            <a href="#${page__locations__views[opt1].fragment}/${id1}/inspections/${renderLocationDetailsInspectionsPage__currentView}" class="nav-link">Inspections</a>
          </li>

          <!--
          <li class="nav-item" role="presentation">
            <a href="#${page__locations__views[opt1].fragment}/${id1}/lockers/all" class="nav-link">Lockers</a>
          </li>
          -->
        </ul>
      </div>
    `);
    fixButtonLinks($tabContainer);

    $container.append(`<h2>${renderLocationDetailsInspectionsPage__views[opt2].title}</h2>`);

    return Promise.resolve().then(() => {
      return ajaxes({
        beforeSend(jqXHR) {
          if (auth && auth.sId) {
            jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
          }
        },
        contentType: 'application/json; charset=utf-8',
        method: 'GET',
        url: `/* @echo C3DATA_LOCATIONS_URL */('${id1}')?$select=site_name`
      });
    }).then(({ data }) => {
      const definition = renderLocationDetailsInspectionsPage__views[opt2].definition(auth, opt1, id1);

      const stateSaveWebStorageKey = `locations_${opt1}_${id1}_inspections_${opt2}`;
      if (resetState === 'yes') {
        renderLocationDetailsInspectionsPage__currentView = opt2;
        renderLocationDetailsNotesPage__resetState(opt1, id1);
        renderLocationDetailsInspectionsPage__resetState(opt1, id1);
      }

      const views = Object.keys(renderLocationDetailsInspectionsPage__views).map((key) => ({
        title: renderLocationDetailsInspectionsPage__views[key].title,
        fragment: `${renderLocationDetailsInspectionsPage__views[key].fragment}?${query__objectToString({ resetState: 'yes' })}`,
        isCurrent: key === opt2
      }));

      return Promise.resolve().then(() => {
        return renderDatatable($container, definition, {
          auth,
          url: '/* @echo C3DATA_LOCATION_INSPECTIONS_URL */',

          newButtonLabel: 'New Inspections',
          newButtonFragment: `${renderLocationDetailsInspectionsPage__views[opt2].fragment(opt2, id1)}/new`,

          stateSaveWebStorageKey,

          views
        });
      }).then(() => {
        const breadcrumbs = [
          { name: app.name, link: '#home' },
          { name: 'Locations', link: `#${page__locations__views.all.fragment}` },
          { name: page__locations__views[opt1].breadcrumb, link: `#${page__locations__views[opt1].fragment}` },
          { name: data.site_name, link: `#${page__locations__views[opt1].fragment}/${data.id}` },
          { name: 'Inspections', link: `#${renderLocationDetailsInspectionsPage__views.all.fragment(opt2, id1)}` },
          { name: renderLocationDetailsInspectionsPage__views[opt2].breadcrumb, link: `#${renderLocationDetailsInspectionsPage__views[opt2].fragment(opt2, id1)}` }
        ];
        app.setBreadcrumb(breadcrumbs, true);

        app.setTitle(data.site_name);
      });
    }, (error) => {
      const breadcrumbs = [
        { name: app.name, link: '#home' },
        { name: 'Locations', link: `#${page__locations__views.all.fragment}` },
        { name: page__locations__views[opt1].breadcrumb, link: `#${page__locations__views[opt1].fragment}` },
        { name: 'Error' }
      ];
      app.setBreadcrumb(breadcrumbs, true);

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
