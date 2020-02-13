/* global $ moment ajaxes */

/* exported entityPaymentDetails__fields */
const entityPaymentDetails__fields = {
  customer: (auth) => ({
    title: 'Customer',
    bindTo: 'customer',
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
      url: '/* @echo C3DATA_CUSTOMERS_URL */?$select=id,first_name,last_name,email&$filter=subscription_type ne null and __Status eq \'Active\'&orderby=first_name,last_name,email'
    },
    choicesMap(data) {
      if (data && data.value) {
        return data.value.map((item) => {
          return {
            text: `${item.first_name} ${item.last_name} ${item.email || ''}`,
            value: item.id
          };
        });
      }
      return [];
    },
    postRender({ model, field }) {
      const handler = () => {
        if (model.isNew()) {
          $(`#${field.id}`).show();
        } else {
          $(`#${field.id}`).hide();
        }
      };
      handler();
      // model.on(`change:${model.idAttribute}`, handler);

      const handler2 = () => {
        const value = model.get(field.bindTo);
        if (!value) {
          model.set('customer_subscription_type');
          model.unset('customer_first_name');
          model.unset('customer_last_name');
          model.unset('customer_title');
          model.unset('customer_email');
          model.unset('customer_primary_phone');
          model.unset('customer_alternate_phone');
          model.unset('customer_civic_address');
          model.unset('customer_municipality');
          model.unset('customer_province');
          model.unset('customer_postal_code');
        } else {
          ajaxes({
            beforeSend(jqXHR) {
              if (auth && auth.sId) {
                jqXHR.setRequestHeader('Authorization', `AuthSession ${auth.sId}`);
              }
            },
            contentType: 'application/json; charset=utf-8',
            method: 'GET',
            url: `/* @echo C3DATA_CUSTOMERS_URL */('${value}')`
          }).then(({ data }) => {
            model.set('customer_subscription_type', data.subscription_type);
            model.set('customer_first_name', data.first_name);
            model.set('customer_last_name', data.last_name);
            model.set('customer_title', data.title);
            model.set('customer_email', data.email);
            model.set('customer_primary_phone', data.primary_phone);
            model.set('customer_alternate_phone', data.alternate_phone);
            model.set('customer_civic_address', data.civic_address);
            model.set('customer_municipality', data.municipality);
            model.set('customer_province', data.province);
            model.set('customer_postal_code', data.postal_code);
          });
        }
      };
      model.on(`change:${field.bindTo}`, handler2);
    },
  }),

  customer_subscription_type: {
    title: 'Subscription Type',
    bindTo: 'customer_subscription_type',
    required: true,
    type: 'text',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },
  customer_first_name: {
    title: 'First Name',
    bindTo: 'customer_first_name',
    required: true,
    type: 'text',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },
  customer_last_name: {
    title: 'Last Name',
    bindTo: 'customer_last_name',
    required: true,
    type: 'text',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },
  customer_title: {
    title: 'Title',
    bindTo: 'customer_title',
    type: 'text',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },

  customer_email: {
    title: 'Email',
    bindTo: 'customer_email',
    type: 'email',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },
  customer_primary_phone: {
    title: 'Primary Phone',
    bindTo: 'customer_primary_phone',
    type: 'phone',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },
  customer_alternate_phone: {
    title: 'Alternate Phone',
    bindTo: 'customer_alternate_phone',
    type: 'phone',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },

  customer_civic_address: {
    title: 'Street Address',
    bindTo: 'customer_civic_address',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },
  customer_municipality: {
    title: 'City',
    bindTo: 'customer_municipality',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },
  customer_province: {
    title: 'Province',
    bindTo: 'customer_province',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },
  customer_postal_code: {
    title: 'Postal Code',
    bindTo: 'customer_postal_code',
    htmlAttr: { readOnly: true },
    postRender({ model, field }) {
      const $element = $(`[name="${field.id}"]`);
      model.on(`change:${field.bindTo}`, () => {
        if (!model.has(field.bindTo)) {
          $element.val('');
        } else {
          $element.val(model.get(field.bindTo));
        }
      });
    }
  },

  locker_item: {
    type: 'html',
    html: '',
    className: 'hide col-md-4',
    postRender({ model, field, section }) {
      const $element = $(`#${field.id}Element`);

      $element.html(`
        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
          <h4>Locker Subscription</h4>

          <p>Description...</p>

          <div class="row" style="margin-bottom: 10px">
            <div class="col-sm-6">
              <strong>Price:</strong> $10.00
            </div>
            <div class="col-sm-6">
              <strong>Quantity:</strong>
              <select>
                <option value="1">1 Months</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
                <option value="7">7 Months</option>
                <option value="8">8 Months</option>
                <option value="9">9 Months</option>
                <option value="10">10 Months</option>
                <option value="11">11 Months</option>
                <option value="12">12 Months</option>
              </select>
            </div>
          </div>

          <p><button class="btn btn-default btn-block" type="button">Add to cart</button></p>
        <div>
      `);

      const $select = $element.find('select');

      const $button = $element.find('button');
      $button.on('click', () => {
        const array = model.get('items') || [];
        array.push({
          "details": "Locker Subscription",
          "quantity": +$select.val(),
          "quantity_unit": "Month",
          "price": 10.00,
          "total": +$select.val() * 10
        });
        model.set('items', array);
        section.cart.render();
      });

      model.on('change:customer_subscription_type', () => {
        if (model.get('customer_subscription_type') === 'Bicycle Locker') {
          $element.removeClass('hide');
        } else {
          $element.addClass('hide');
        }
      });
    }
  },
  lockerkey_item: {
    type: 'html',
    html: '',
    className: 'hide col-md-4',
    postRender({ model, field, section }) {
      const $element = $(`#${field.id}Element`);

      $element.html(`
        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
          <h4>Locker Key Replacement</h4>

          <p>Description...</p>

          <p><strong>Price:</strong> $10.00</p>

          <p><button class="btn btn-default btn-block" type="button">Add to cart</button></p>
        </div>
      `);

      const $button = $element.find('button');
      $button.on('click', () => {
        const array = model.get('items') || [];
        array.push({
          "details": "Locker key replacement",
          "quantity": 1,
          "quantity_unit": "Month",
          "price": 10.00,
          "total": 10.00
        });
        model.set('items', array);
        section.cart.render();
      });

      model.on('change:customer_subscription_type', () => {
        if (model.get('customer_subscription_type') === 'Bicycle Locker') {
          $element.removeClass('hide');
        } else {
          $element.addClass('hide');
        }
      });
    }
  },
  station_item: {
    type: 'html',
    html: '',
    className: 'hide col-md-4',
    postRender({ model, field }) {
      const $element = $(`#${field.id}Element`);

      $element.html(`
        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
          <h4>Station Subscription</h4>

          <p>Description...</p>

          <div class="row" style="margin-bottom: 10px">
            <div class="col-sm-6">
              <strong>Price:</strong> $10.00
            </div>
            <div class="col-sm-6">
              <strong>Quantity:</strong>
              <select>
                <option value="1">1 Months</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
                <option value="6">6 Months</option>
                <option value="7">7 Months</option>
                <option value="8">8 Months</option>
                <option value="9">9 Months</option>
                <option value="10">10 Months</option>
                <option value="11">11 Months</option>
                <option value="12">12 Months</option>
              </select>
            </div>
          </div>

          <p><button class="btn btn-default btn-block" type="button">Add to cart</button></p>
        </div>
      `);

      model.on('change:customer_subscription_type', () => {
        if (model.get('customer_subscription_type') === 'Bicycle Station') {
          $element.removeClass('hide');
        } else {
          $element.addClass('hide');
        }
      });
    }
  },
  keyfob_item: {
    type: 'html',
    html: '',
    className: 'hide col-md-4',
    postRender({ model, field }) {
      const $element = $(`#${field.id}Element`);

      $element.html(`
        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
          <h4>Key Fob Replacement</h4>

          <p>Description...</p>

          <p><strong>Price:</strong> $10.00</p>

          <p><button class="btn btn-default btn-block" type="button">Add to cart</button></p>
        </div>
      `);

      model.on('change:customer_subscription_type', () => {
        if (model.get('customer_subscription_type') === 'Bicycle Station') {
          $element.removeClass('hide');
        } else {
          $element.addClass('hide');
        }
      });
    }
  },
  registration: {
    type: 'html',
    html: '',
    className: 'hide col-md-4',
    postRender({ model, field }) {
      const $element = $(`#${field.id}Element`);

      $element.html(`
        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
          <h4>Registration Fee</h4>

          <p>Description...</p>

          <p><strong>Price:</strong> $10.00</p>

          <p><button class="btn btn-default btn-block" type="button">Add to cart</button></p>
        </div>
      `);

      model.on('change:customer_subscription_type', () => {
        if (model.get('customer_subscription_type') === 'Bicycle Station') {
          $element.removeClass('hide');
        } else {
          $element.addClass('hide');
        }
      });
    }
  },
  cart: {
    type: 'html',
    html: '',
    postRender: ({ section, field, model }) => {
      const $element = $(`#${field.id}Element`);
      section.cart = $element;
      $element.render = () => {
        let total = 0;
        const items = model.get('items') || [];

        $element.html(`
        <table class="table" width="100%">
          <thead>
            <tr>
              <th>Details</th>
              <th style="width: 10%; text-align: right;">Quantity</th>
              <th style="width: 10%; text-align: right;">Price</th>
              <th style="width: 10%; text-align: right;">Total</th>
              <th style="width: 10%;"><span class="sr-only">Action</span></th>
            </tr>
          </thead>

          <tbody>
            ${items.length === 0 ? '<tr><td colspan="5" style="text-align: center;">Empty</td></tr>' : items.map((item) => {
              total = total + item.total;
              return `
                <tr>
                  <td>${item.details}</td>
                  <td style="text-align: right">${item.quantity} ${item.quantity_unit}</td>
                  <td style="text-align: right">$${item.price.toFixed(2)}</td>
                  <td style="text-align: right">$${item.total.toFixed(2)}</td>
                  <td><button class="btn btn-cancel" type="button">Remove</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>

          <tfoot>
            <tr>
              <td style="border-top: 2px solid #346488; text-align: right;" colspan="3">Sub total</td>
              <td style="border-top: 2px solid #346488; width: 10%; text-align: right;">$${total.toFixed(2)}</td>
              <td style="border-top: 2px solid #346488; width: 10%;">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: right;" colspan="3">Tax (13%)</td>
              <td style="width: 10%; text-align: right;">$${(total * 0.13).toFixed(2)}</td>
              <td style="width: 10%;">&nbsp;</td>
            </tr>
            <tr>
              <td style="text-align: right;" colspan="3">Total</td>
              <td style="width: 10%; text-align: right;">$${(total + (total * 0.13)).toFixed(2)}</td>
              <td style="width: 10%;">&nbsp;</td>
            </tr>
          </tfoot>
        </table>
      `);
      };
      $element.render();
    }
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
