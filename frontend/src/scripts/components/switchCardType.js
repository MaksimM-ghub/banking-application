import { el, setChildren } from 'redom';

import visa from '../../images/visa-logo.svg';
import mastercard from '../../images/mastercard-logo.svg';
import mir from '../../images/mir-logo.svg';

export function switchCardType(startNumber, imgContainer) {
  setChildren(imgContainer, []);
  let src = '';
  let type = '';

  if (startNumber.startsWith('22')) {
    src = mir;
    type = 'mir';
  } else if (startNumber.startsWith('4')) {
    src = visa;
    type = 'visa';
  } else if (startNumber.startsWith('5')) {
    src = mastercard;
    type = 'mastercard';
  } else {
    return;
  }

  if (type !== '') {
    const img = el('img.account-info__img-pay', {
      src: src,
      alt: `Платежная система ${type}`,
    });

    setChildren(imgContainer, [img]);
  }
}
