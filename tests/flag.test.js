import FlagService from '../src/services/FlagService';

describe('FlagService Tests', () => {
  const flagsApiBaseUrl = 'https://flagsapi.codeaid.io/';

  test('check-flag-url-for-valid-country', () => {
    const countryName = 'Japan';
    const flagUrl = FlagService.getFlagUrl(countryName);
    expect(flagUrl).toBe(`${flagsApiBaseUrl}Japan.png`);
  });

  test('check-flag-url-with-spaces-in-country-name', () => {
    const countryNameWithSpaces = 'New Zealand';
    const flagUrl = FlagService.getFlagUrl(countryNameWithSpaces);
    expect(flagUrl).toBe(`${flagsApiBaseUrl}New%20Zealand.png`);
  });

  test('check-flag-url-with-missing-country-name', () => {
    console.error = jest.fn();
    const flagUrl = FlagService.getFlagUrl('');
    expect(flagUrl).toBe('');
    expect(console.error).toHaveBeenCalledWith(
      'Country name is required'
    );
  });

  test('check-flag-url-with-special-characters-in-country-name', () => {
    const countryNameWithSpecialChars = "Côte d'Ivoire";
    const flagUrl = FlagService.getFlagUrl(countryNameWithSpecialChars);
    expect(flagUrl).toBe(`${flagsApiBaseUrl}C%C3%B4te%20d'Ivoire.png`);
  });

  test('check-flag-url-base-url-correctness', () => {
    const countryName = 'Sweden';
    const flagUrl = FlagService.getFlagUrl(countryName);
    expect(flagUrl.startsWith(flagsApiBaseUrl)).toBe(true);
  });
});
