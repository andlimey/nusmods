import { normalize } from './normalizeString';

/* eslint-disable max-len */

describe(normalize, () => {
  it('removes GCE prerequisites 1', () => {
    const testString =
      'GCE ‘A’ Level or H2 Mathematics or H2 Further Mathematics or MA1301 or MA1301FC or MA1301X';
    const expected = 'MA1301 or MA1301FC or MA1301X';
    expect(normalize(testString)).toBe(expected);
  });

  it('removes GCE prerequisites 2', () => {
    const testString = 'CS3240 and (MA1301 or A-level / H2 Mathematics)';
    const expected = 'CS3240 and (MA1301)';
    expect(normalize(testString)).toBe(expected);
  });

  // Edge case that currently isn't handled.
  it('removes GCE prerequisites 3', () => {
    const testString = 'MA1301 or GCE ‘A’ Level or MA1301FC';
    const expected = 'MA1301MA1301FC';
    expect(normalize(testString)).toBe(expected);
  });

  it('converts commas to delimiter or', () => {
    const testString =
      'ACC1002 Financial Accounting, BSP1004 Legal Environment of Business, FIN2004 Finance';
    const expected =
      'ACC1002 Financial Accounting or BSP1004 Legal Environment of Business or FIN2004 Finance';
    expect(normalize(testString)).toBe(expected);
  });

  it('converts commas to delimiter and when written like a sentence', () => {
    const testString =
      'ACC1002 Financial Accounting, BSP1004 Legal Environment of Business, and FIN2004 Finance';
    const expected =
      'ACC1002 Financial Accounting and BSP1004 Legal Environment of Business and FIN2004 Finance';
    expect(normalize(testString)).toBe(expected);
  });

  it('splits conjoined operators', () => {
    const testString = 'MA1505and MA1506';
    const expected = 'MA1505 and MA1506';
    expect(normalize(testString)).toBe(expected);
  });

  it('splits / module codes into respective modules', () => {
    const testString = 'CS2103/T';
    const expected = 'CS2103 or CS2103T';
    expect(normalize(testString)).toBe(expected);
  });

  it('removes module titles that contains operators 1', () => {
    const testString =
      'ACC3616 Corporate Governance and Risk Management or ACC3612 Risk Management and Internal Control';
    const expected = 'ACC3616 Corporate Management or ACC3612 Risk Control';
    expect(normalize(testString)).toBe(expected);
  });

  it('removes module titles that contains operators 2', () => {
    const testString = '(Undergraduate physics and mathematics AND Electronics materials courses)';
    const expected = '( materials courses)';
    expect(normalize(testString)).toBe(expected);
  });

  it('replaces synonyms', () => {
    const testString = '[(CM1121 or CM1501) plus (LSM1101 or LSM1401 or MLE1101)] or MLE3104';
    const expected = '((CM1121 or CM1501) and (LSM1101 or LSM1401 or MLE1101)) or MLE3104';
    expect(normalize(testString)).toBe(expected);
  });

  it('lowercases operators', () => {
    const testString = '(1) Either BSP1005 or EC1301 AND (2) Either DSC2008 or EC2303';
    const expected = '(1) Either BSP1005 or EC1301 and (2) Either DSC2008 or EC2303';
    expect(normalize(testString)).toBe(expected);
  });

  it('changes roman numerals to digits', () => {
    const expected = '(1) CS1000 (2) CS1001';
    expect(normalize('(i) CS1000 (ii) CS1001')).toBe(expected);
    expect(normalize('i) CS1000 ii) CS1001')).toBe(expected);
  });

  it('changes alphabets to digits', () => {
    const expected = '(1) CS1000 (2) CS1001';
    expect(normalize('(a) CS1000 (b) CS1001')).toBe(expected);
    expect(normalize('a) CS1000 b) CS1001')).toBe(expected);
    expect(normalize('a) CS1000 or b) CS1001')).toBe('(1) CS1000 or (2) CS1001');
  });

  it('does not change modules or operators to digits', () => {
    const testString1 = '(CS1000)';
    expect(normalize(testString1)).toBe(testString1);
    const testString2 = 'CS1000)';
    expect(normalize(testString2)).toBe(testString2);
    const testString3 = '(or)';
    expect(normalize(testString3)).toBe(testString3);
  });

  it('fixes listing brackets', () => {
    expect(normalize('1) CS1000 2) CS1001')).toBe('(1) CS1000 (2) CS1001');
  });

  it('changes listing into brackets given that an operator exists', () => {
    expect(normalize('1) CS1000 or 2) CS1001')).toBe('(1) CS1000 or (2) CS1001');
  });
});
