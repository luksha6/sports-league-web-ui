import ApiService, { API_BASE_URL } from '../src/services/ApiService';

require('jest-fetch-mock').enableMocks();

describe('ApiService Unit Tests', () => {
  const apiBaseUrl = 'http://localhost:3001/api';

  beforeAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    fetch.resetMocks();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    console.error.mockClear();
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  test('check-api-version-fetch-success', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true, version: 'v1.0' }));

    const fetchedApiVersion = await ApiService.getApiVersion();
    expect(fetchedApiVersion).toBe('v1.0');
    expect(fetch).toHaveBeenCalledWith(`${apiBaseUrl}/version`);
  });

  test('check-api-version-fetch-failure', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: false }));

    const fetchedApiVersion = await ApiService.getApiVersion();
    expect(fetchedApiVersion).toBeNull();
    expect(fetch).toHaveBeenCalledWith(`${apiBaseUrl}/version`);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching API version:',
      expect.any(Error)
    );
  });

  test('check-access-token-fetch-success', async () => {
    const mockToken = 'mocked_token';
    fetch.mockResponseOnce(
      JSON.stringify({ success: true, access_token: mockToken })
    );

    const fetchedToken = await ApiService.fetchAccessToken();
    expect(fetchedToken).toBe(mockToken);
    expect(fetch).toHaveBeenCalledWith(`${apiBaseUrl}/v1/getAccessToken`);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      ApiService.tokenKey,
      mockToken
    );
  });

  test('check-access-token-fetch-failure', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: false }));

    const fetchedToken = await ApiService.fetchAccessToken();
    expect(fetchedToken).toBeNull();
    expect(fetch).toHaveBeenCalledWith(`${apiBaseUrl}/v1/getAccessToken`);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching access token:',
      expect.any(Error)
    );
  });

  test('check-store-token', () => {
    const token = 'sample_token';
    ApiService.storeToken(token);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      ApiService.tokenKey,
      token
    );
  });

  test('check-get-token', () => {
    const token = 'sample_token';
    localStorage.getItem.mockReturnValue(token);

    const storedToken = ApiService.getToken();
    expect(storedToken).toBe(token);
    expect(localStorage.getItem).toHaveBeenCalledWith(ApiService.tokenKey);
  });

  test('check-clear-token', () => {
    ApiService.clearToken();
    expect(localStorage.removeItem).toHaveBeenCalledWith(ApiService.tokenKey);
  });

  test('check-api-base-url-correctness', () => {
    expect(API_BASE_URL).toBe(apiBaseUrl);
  });
});
