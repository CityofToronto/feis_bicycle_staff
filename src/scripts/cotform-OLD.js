/* global cot_form $ */
cot_form.prototype.processField = function (oRow, oVal, row, field) {
  var intFields = row.fields.length;
  var oField = oRow.appendChild(document.createElement('div'));
  oField.id = field.id + 'Element';
  oField.className = field['className'] || ((intFields == 1) ? "col-xs-12" : (intFields == 2) ? "col-xs-12 col-sm-6" : (intFields == 3) ? "col-xs-12 col-md-4" : "col-xs-12 col-sm-6 col-md-3");
  oField.className += ' form-group form-group-';
  oField.className += field.orientation || 'vertical';
  oField.className += field.addclass ? " " + field.addclass : '';
  var oFieldDiv = oField.appendChild(document.createElement('div'));

  //LABEL
  if (['html', 'button', 'cart', 'cartitem'].indexOf(field.type) == -1) {
    var useLabel = ['static', 'checkbox', 'radio'].indexOf(field.type) === -1;
    if (useLabel || field.title) {
      var label = oFieldDiv.appendChild(document.createElement(useLabel ? 'label' : 'span'));
      label.className = useLabel ? 'control-label' : 'staticlabel' + (field.type != 'static' ? ' ' + field.type : '');
      if (useLabel) {
        label.htmlFor = field.id;
      }

      var titleSpan = label.appendChild(document.createElement('span'));
      titleSpan.textContent = field.title;
      if (field.type === 'multiselect') {
        $(label).attr('id', field.id + '_label');
        $(titleSpan).append($('<span class="sr-only">:</span>'));
      }
      if (!field.required && field.type != 'static') {
        var optionalLabel = label.appendChild(document.createElement('span'));
        optionalLabel.className = 'optional';
        optionalLabel.textContent = '(optional)';
      }
      if (field.infohelp) {
        var tooltip = label.appendChild(document.createElement('span'));
        tooltip.className = 'glyphicon glyphicon-info-sign';
        tooltip.setAttribute('data-toggle', 'tooltip');
        tooltip.setAttribute('data-placement', 'top');
        tooltip.tabIndex = 0;
        tooltip.title = field.infohelp;
      }
    }
  }
  this.addprehelptext(field, oFieldDiv);
  this.addformfield(field, oFieldDiv);
  this.addposthelptext(field, oFieldDiv);
  this.addfieldvalidation(oVal, field, oFieldDiv);
};

cot_form.prototype.cartitemFieldRender = function ({
  id,
  title,
  description,
  price = 0,
  quantity_min = 1,
  quantity_max = 1,
  quantity_increment = 1,
  quantity_default = quantity_min,
  quantity_unit_single = 'item',
  quantity_unit = `${quantity_unit_single}s`,
} = {}) {
  const fragment = new DocumentFragment();

  // Title
  if (title != null) {
    const titleEl = fragment.appendChild(document.createElement('h3'));
    titleEl.style.marginTop = '0';
    titleEl.innerHTML = title;
  }

  // Description
  if (description != null) {
    const descriptionEl = fragment.appendChild(document.createElement('div'));
    descriptionEl.style.marginBottom = '10px';
    descriptionEl.innerHTML = description;
  }

  const bottomEl = fragment.appendChild(document.createElement('div'));
  bottomEl.classList.add('clearfix', 'form-inline');
  bottomEl.style.marginBottom = '10px';

  // Price
  const priceEl = bottomEl.appendChild(document.createElement('div'));
  priceEl.classList.add('pull-left');
  priceEl.style.padding = '6px 0';
  priceEl.innerHTML = `<strong>Price:</strong> $${price.toFixed(2)}`;

  const rightEl = bottomEl.appendChild(document.createElement('div'));
  rightEl.classList.add('pull-right');

  // Quantity
  const quatityGroupEl = rightEl.appendChild(document.createElement('div'))
  quatityGroupEl.classList.add('form-group');
  quatityGroupEl.style.marginBottom = '0';

  const quantityLabelEl = quatityGroupEl.appendChild(document.createElement('label'));
  quantityLabelEl.setAttribute('for', id);
  quantityLabelEl.textContent= 'Quantity';

  const quantityEl = quatityGroupEl.appendChild(document.createElement('select'));
  quantityEl.setAttribute('id', id);
  quantityEl.classList.add('form-control');
  quantityEl.style.marginLeft = '3px';
  quantityEl.style.marginRight = '3px';

  for (let value = quantity_min; value <= quantity_max; value = value + quantity_increment) {
    const quantityItemEl = quantityEl.appendChild(document.createElement('option'));
    quantityItemEl.setAttribute('value', value);
    quantityItemEl.textContent = `${value} ${value === 1 ? quantity_unit_single : quantity_unit}`;
    if (value === quantity_default) {
      quantityItemEl.setAttribute('selected', '');
    }
  }

  const bellowEl = fragment.appendChild(document.createElement('div'));
  bellowEl.classList.add('clearfix', 'text-right');
  // bellowEl.style.marginBottom = '5px';

  const buttonEl = bellowEl.appendChild(document.createElement('button'));
  buttonEl.innerHTML = `Add ${title} to Cart`;
  buttonEl.classList.add('btn', 'btn-default', 'btn-block');


  const cardEl = document.createElement('div');
  cardEl.style.border = '1px solid #dddddd';
  cardEl.style.borderRadius = '4px';
  cardEl.style.padding = '30px';
  cardEl.style.marginBottom = '7px';
  cardEl.style.marginTop = '7px';
  cardEl.appendChild(fragment);

  return cardEl;
};

cot_form.prototype.cartFieldRender = function ({ id } = {}) {

  const fragment = new DocumentFragment();

  const tableEl = fragment.appendChild(document.createElement('table'));
  tableEl.setAttribute('id', id);
  tableEl.classList.add('table');

  const colgroupEl = tableEl.appendChild(document.createElement('colgroup'));
  colgroupEl.appendChild(document.createElement('col'));

  const colEl = colgroupEl.appendChild(document.createElement('col'));
  colEl.setAttribute('span', 3);
  colEl.setAttribute('width', '150px');

  colgroupEl.appendChild(document.createElement('col')).setAttribute('width', '100');

  const theadEl = tableEl.appendChild(document.createElement('thead'));

  let trEl = theadEl.appendChild(document.createElement('tr'));
  trEl.appendChild(document.createElement('th')).textContent = 'Product';

  let thEl = trEl.appendChild(document.createElement('th'));
  thEl.classList.add('text-right');
  thEl.textContent = 'Quantity';

  thEl = trEl.appendChild(document.createElement('th'));
  thEl.classList.add('text-right');
  thEl.textContent = 'Price';

  thEl = trEl.appendChild(document.createElement('th'));
  thEl.classList.add('text-right');
  thEl.textContent = 'Total';

  trEl.appendChild(document.createElement('th')).textContent = 'Action';

  const tfootEl = tableEl.appendChild(document.createElement('tfoot'));

  let tfootRowEl = tfootEl.appendChild(document.createElement('tr'));
  tfootRowEl.style.borderTop = '2px solid #346488';

  let tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.setAttribute('colspan', 3);
  tdEl.classList.add('text-right');
  tdEl.textContent = 'Subtotal';

  tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.classList.add('text-right');
  tdEl.textContent = '$0.00';

  tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.textContent = '';

  tfootRowEl = tfootEl.appendChild(document.createElement('tr'));

  tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.setAttribute('colspan', 3);
  tdEl.classList.add('text-right');
  tdEl.textContent = 'Tax';

  tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.classList.add('text-right');
  tdEl.textContent = '$0.00';

  tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.textContent = '';

  tfootRowEl = tfootEl.appendChild(document.createElement('tr'));

  tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.setAttribute('colspan', 3);
  tdEl.classList.add('text-right');
  tdEl.textContent = 'Total';

  tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.classList.add('text-right');
  tdEl.textContent = '$0.00';

  tdEl = tfootRowEl.appendChild(document.createElement('td'));
  tdEl.textContent = '';

  const tbodyEl = tableEl.appendChild(document.createElement('tbody'));

  for (let index = 0; index < 5; index++) {
    trEl = tbodyEl.appendChild(document.createElement('tr'));

    tdEl = trEl.appendChild(document.createElement('td'));
    tdEl.textContent = 'Product';

    tdEl = trEl.appendChild(document.createElement('td'));
    tdEl.classList.add('text-right');
    tdEl.textContent = '1 Item';

    tdEl = trEl.appendChild(document.createElement('td'));
    tdEl.classList.add('text-right');
    tdEl.textContent = '$0.00';

    tdEl = trEl.appendChild(document.createElement('td'));
    tdEl.classList.add('text-right');
    tdEl.textContent = '$0.00';

    tdEl = trEl.appendChild(document.createElement('td'));
    const removeBtn = tdEl.appendChild(document.createElement('button'));
    removeBtn.classList.add('btn', 'btn-cancel', 'btn-block');
    removeBtn.textContent = 'Remove';
  }


  var el = document.createElement('p');
  el.textContent = 'CART';
  fragment.appendChild(el);

  return fragment;
};
