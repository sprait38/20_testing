/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import 'babel-polyfill';
import { mount, el } from 'redom';
import { isValid, getCreditCardNameByNumber } from 'creditcard.js';
import IMask from 'imask';
import { validateCvc, validateEmail, validateEndDate } from './validFunction';

import logoVisa from './assets/img/visa.svg';
import logoMastercard from './assets/img/mastercard.svg';
import logoMir from './assets/img/mir.svg';

export function validCardNum(str = '') {
  if (!str) return false;
  const strWithoutSpaces = str.trim().replaceAll(/\s/g, '');
  let result = isValid(strWithoutSpaces);
  let card = getCreditCardNameByNumber(strWithoutSpaces);
  if (strWithoutSpaces.startsWith('2200')) {
    result = strWithoutSpaces.length === 16;
    card = 'MIR';
  }
  if (!result) card = '';
  checkImg(card);
  return result;
}
function checkImg(card = '') {
  const svgPaySystem = document.querySelector('#svgCardImg');
  switch (card.toLowerCase()) {
    case 'visa':
      svgPaySystem.src = logoVisa;
      break;
    case 'mastercard':
      svgPaySystem.src = logoMastercard;
      break;
    case 'mir':
      svgPaySystem.src = logoMir;
      break;
    default:
      svgPaySystem.src = card;
      break;
  }
}

// eslint-disable-next-line import/prefer-default-export
export const createForm = () => {
  const payBtn = el('button.btn.btn-primary', { type: 'submit', disabled: true }, 'Оплатить');
  const cardNameEl = el('h2.mt-3');
  const svgPaySystem = el('img#svgCardImg', { style: { maxWidth: '200px' } });

  const checkDisableButton = () => {
    const errElement = document.querySelector('.is-invalid');
    payBtn.disabled = !!errElement || !form.checkValidity();
  };

  const createInput = ({
    nameId,
    placeholder = '',
    label = '',
    validateFunc = () => false,
    errorMessage = 'Неверный формат',
    addClass = '',
    mask,
    cardNum = '',
  }) => {
    const labelEl = label ? el('label.form-label', { for: nameId }, label) : null;
    const errorMessageEl = el('.invalid-feedback', errorMessage);
    const inputEl = el('input.form-control', {
      id: nameId,
      name: nameId,
      type: 'text',
      placeholder,
      required: true,
      novalidate: true,
      oninput() {
        inputEl.classList.remove('is-invalid');
      },
    });

    let masked = null;
    if (mask) masked = IMask(inputEl, mask);
    inputEl.onblur = (e) => {
      const result = validateFunc(mask ? masked.unmaskedValue : e.target.value, cardNum);
      if (!result) inputEl.classList.add('is-invalid');
      else inputEl.classList.remove('is-invalid');
      checkDisableButton();
      return result;
    };
    return {
      block: el(`.mb-3${addClass}`, label, inputEl, errorMessageEl),
      input: inputEl,
      label: labelEl,
    };
  };

  const cardNumInput = createInput({
    nameId: 'cardNum',
    placeholder: 'Номер карты',
    label: 'Введите номер карты',
    validateFunc: validCardNum,
    errorMessage: 'Неверный формат номера карты!',
    mask: { mask: '0000 0000 0000 0000000' },
  });
  const endDateInput = createInput({
    nameId: 'endDate',
    placeholder: 'ММ/ГГ',
    validateFunc: validateEndDate,
    errorMessage: 'Неправильно введена дата!',
    mask: { mask: '00/00', maxLength: 4 },
  });
  const cvcInput = createInput({
    nameId: 'cvcCode',
    placeholder: 'CVV/CVC',
    validateFunc: validateCvc,
    errorMessage: 'Неправильно введен код CVC/CVV!',
    mask: { mask: '000', maxLength: 3 },
    cardNum: cardNumInput.input.value.replaceAll(/[^\d]/g, ''),
  });
  const emailInput = createInput({
    nameId: 'email',
    placeholder: 'Email',
    validateFunc: validateEmail,
    errorMessage: 'Неверно введен email!',
  });
  const form = el(
    'form.mb-3',
    {
      style: { width: '400px', margin: 'auto' },
      novalidate: true,
      onsubmit(e) {
        e.preventDefault();
        cardNameEl.textContent = 'Оплачено';
      },
    },
    cardNumInput.block,
    endDateInput.block,
    cvcInput.block,
    emailInput.block,
    payBtn,
    cardNameEl,
    svgPaySystem
  );
  return form;
};

const form = createForm();
mount(document.body, form);
