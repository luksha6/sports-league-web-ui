class FlagService {
  constructor(baseUrl = 'https://flagsapi.codeaid.io/') {
    this.baseUrl = baseUrl;
  }

  getFlagUrl(country) {
    if (!country) {
      console.error('Country name is required');
      return '';
    }
    return `${this.baseUrl}${encodeURIComponent(country)}.png`;
  }
}

export default new FlagService();
