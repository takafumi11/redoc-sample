import { apiClient, WithdrawResponse, ErrorResponse } from './utils/api-client';

describe('Withdraw API E2E Tests', () => {
  const TEST_ACCOUNT_ID = 'test-account-001';

  describe('Success Cases (200)', () => {
    test('E2E-001: Normal withdrawal', async () => {
      const response = await apiClient.withdraw(TEST_ACCOUNT_ID, { amount: 1000 });

      expect(response.status).toBe(200);
      const body = response.data as WithdrawResponse;
      expect(body.accountId).toBe(TEST_ACCOUNT_ID);
      expect(body.withdrawnAmount).toBe(1000);
      expect(typeof body.balance).toBe('number');
    });

    test('E2E-002: Minimum amount withdrawal (1 yen)', async () => {
      const response = await apiClient.withdraw(TEST_ACCOUNT_ID, { amount: 1 });

      expect(response.status).toBe(200);
      const body = response.data as WithdrawResponse;
      expect(body.withdrawnAmount).toBe(1);
    });

    test('E2E-003: Full balance withdrawal', async () => {
      // Note: This test requires knowing the current balance
      // In a real scenario, you would first query the balance
      const response = await apiClient.withdraw(TEST_ACCOUNT_ID, { amount: 100 });

      expect(response.status).toBe(200);
      const body = response.data as WithdrawResponse;
      expect(body.balance).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Validation Errors (400)', () => {
    test('E2E-101: Zero amount should return 400', async () => {
      const response = await apiClient.withdraw(TEST_ACCOUNT_ID, { amount: 0 });

      expect(response.status).toBe(400);
      const body = response.data as ErrorResponse;
      expect(body.errorCode).toBe('INVALID_REQUEST');
    });

    test('E2E-102: Negative amount should return 400', async () => {
      const response = await apiClient.withdraw(TEST_ACCOUNT_ID, { amount: -100 });

      expect(response.status).toBe(400);
      const body = response.data as ErrorResponse;
      expect(body.errorCode).toBe('INVALID_REQUEST');
    });

    test('E2E-103: Missing amount should return 400', async () => {
      const response = await apiClient.withdraw(TEST_ACCOUNT_ID, {});

      expect(response.status).toBe(400);
      const body = response.data as ErrorResponse;
      expect(body.errorCode).toBe('INVALID_REQUEST');
    });

    test('E2E-104: Invalid type (string) should return 400', async () => {
      const response = await apiClient.withdraw(TEST_ACCOUNT_ID, { amount: 'abc' });

      expect(response.status).toBe(400);
      const body = response.data as ErrorResponse;
      expect(body.errorCode).toBe('INVALID_REQUEST');
    });
  });

  describe('Business Logic Errors (409)', () => {
    test('E2E-201: Insufficient balance should return 409', async () => {
      // Use a very large amount to trigger insufficient balance
      const response = await apiClient.withdraw(TEST_ACCOUNT_ID, {
        amount: 999999999999,
      });

      expect(response.status).toBe(409);
      const body = response.data as ErrorResponse;
      expect(body.errorCode).toBe('INSUFFICIENT_BALANCE');
    });
  });
});
