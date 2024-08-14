/* eslint-disable prettier/prettier */
import 'babel-polyfill';
import is from 'is_js';
import { isValid, isExpirationDateValid, isSecurityCodeValid } from 'creditcard.js';

export const validCardNum = (str = '') => {
    if (!str) return false;
    const strWithoutSpaces = str.trim().replaceAll(/\s/g, '');
    let result = isValid(strWithoutSpaces);
    if (strWithoutSpaces.startsWith('2200')) {
        result = strWithoutSpaces.length === 16;
    }
    return result;
};

export const validateEndDate = (str = '') => {
    if (str.match(/[^\d^/]/) || !str) return false;
    const strClean = str.replaceAll(/[^\d]/g, '');
    return isExpirationDateValid(strClean.substring(0, 2), str.substring(2));
};

export const validateCvc = (str = '', cardNum = '') => {
    if (!str || str.match(/[^\d]/) || str.length !== 3) return false;
    return isSecurityCodeValid(cardNum, str);
};

export const validateEmail = (str = '') => is.email(str);