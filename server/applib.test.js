const applib = require('../server/applib');

test('checkEmail', () => {
  expect(applib.checkEmail('gastons@live.com.mx')).toBe(true);
  expect(applib.checkEmail('gast.ons@li@ve.com.mx')).toBe(false);
});

test('checkPassword', () => {
    expect(applib.checkPassword('pass123')).toBe(false);
    expect(applib.checkPassword('12345678')).toBe(false);
    expect(applib.checkPassword('abcdefgh')).toBe(false);
    expect(applib.checkPassword('pass1234')).toBe(true);
    expect(applib.checkPassword('pass12@#')).toBe(true);
});

test('checkFullname', () => {
    expect(applib.checkFullname('name')).toBe(false);
    expect(applib.checkFullname('name1')).toBe(true);
    expect(applib.checkFullname('name0123456789')).toBe(true);
});
