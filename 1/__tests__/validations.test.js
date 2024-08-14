import { validateCvc, validCardNum } from '../src/validFunction';
import { createForm } from '../src/index';

test('Валидация номера карты пропускает корректный номер карты.', () => {
  expect(validCardNum('4111 1111 1110 0023')).toBe(true);
  expect(validCardNum('54867320 5886 4471')).toBe(true);
  expect(validCardNum('2200 0054 63416546')).toBe(true);
  expect(validCardNum('2200005463416546')).toBe(true);
});

test('Валидация номера карты не пропускает произвольную строку, содержащую любые нецифровые символы.', () => {
  expect(validCardNum('4asdasd 1221..1 13')).toBe(false);
  expect(validCardNum('asdasdasdasd')).toBe(false);
  expect(validCardNum('2.....//.,..,46')).toBe(false);
  expect(validCardNum('Dorova 123456789')).toBe(false);
  expect(validCardNum('2200 Привет! 3416546')).toBe(false);
});

test('Валидация номера карты не пропускает строку со слишком большим количеством цифр (например, 25).', () => {
  expect(validCardNum('22000054634165462200005463416546')).toBe(false);
  expect(validCardNum('220000546341654622000054634165462200005463416546')).toBe(false);
  expect(validCardNum('4111 1111 1110 0023 4111 1111 1110 0023 4111 1111 1110 0023')).toBe(false);
  expect(validCardNum('2200 0054 634165462200 0054 634165462200 0054 634165462200 0054 634165462200 0054 63416546')).toBe(false);
  expect(validCardNum('2200aaaa34165462200aaaa34165462200aaaa34165462200aaaa34165462200aaaa3416546')).toBe(false);
});

test('Валидация CVV/CVC пропускает строку с тремя цифровыми символами.', () => {
  expect(validateCvc('123')).toBe(true);
  expect(validateCvc('789')).toBe(true);
  expect(validateCvc('456')).toBe(true);
  expect(validateCvc('147')).toBe(true);
  expect(validateCvc('258')).toBe(true);
});

test('Валидация CVV/CVC не пропускает строки с 1-2 цифровыми символами.', () => {
  expect(validateCvc('12')).toBe(false);
  expect(validateCvc('78')).toBe(false);
  expect(validateCvc('4')).toBe(false);
  expect(validateCvc('1')).toBe(false);
  expect(validateCvc('25')).toBe(false);
});

test('Валидация CVV/CVC не пропускает строки с 4+ цифровыми символами.', () => {
  expect(validateCvc('1234')).toBe(false);
  expect(validateCvc('78910')).toBe(false);
  expect(validateCvc('4567890')).toBe(false);
  expect(validateCvc('1234567890')).toBe(false);
  expect(validateCvc('252525252525')).toBe(false);
});

test('Валидация CVV/CVC не пропускает строки с тремя нецифровыми символами (латиница, кириллица и знаки препинания).', () => {
  expect(validateCvc('йоу')).toBe(false);
  expect(validateCvc('фыв')).toBe(false);
  expect(validateCvc('вуц')).toBe(false);
  expect(validateCvc('куц')).toBe(false);
  expect(validateCvc('куч')).toBe(false);
});

test('Функция создания DOM-дерева должна вернуть DOM-элемент, в котором содержится строго четыре поля для ввода с плейсхолдерами «Номер карты», «ММ/ГГ», CVV/CVC, Email.', () => {
  const form = createForm();
  expect(form).toBeInstanceOf(HTMLFormElement);
  const inputsArray = form.querySelectorAll('input');
  expect(inputsArray.length).toBe(4);
  expect(inputsArray[0].placeholder).toBe('Номер карты');
  expect(inputsArray[1].placeholder).toBe('ММ/ГГ');
  expect(inputsArray[2].placeholder).toBe('CVV/CVC');
  expect(inputsArray[3].placeholder).toBe('Email');
});
