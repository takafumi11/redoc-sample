# Withdraw API E2E Test Cases

**Endpoint:** `POST /accounts/{accountId}/withdraw`

## Success Cases (200)

| ID | Description | Request | Expected |
|---|---|---|---|
| E2E-001 | Normal withdrawal | `{ amount: 1000 }` | status: 200, returns accountId/withdrawnAmount/balance |
| E2E-002 | Minimum amount (1 yen) | `{ amount: 1 }` | status: 200, withdrawnAmount: 1 |
| E2E-003 | Full balance withdrawal | `{ amount: <full balance> }` | status: 200, balance: 0 |

## Validation Errors (400)

| ID | Description | Request | Expected |
|---|---|---|---|
| E2E-101 | Zero amount | `{ amount: 0 }` | status: 400, errorCode: INVALID_REQUEST |
| E2E-102 | Negative amount | `{ amount: -100 }` | status: 400, errorCode: INVALID_REQUEST |
| E2E-103 | Missing amount | `{}` | status: 400, errorCode: INVALID_REQUEST |
| E2E-104 | Invalid type (string) | `{ amount: "abc" }` | status: 400, errorCode: INVALID_REQUEST |

## Business Logic Errors (409)

| ID | Description | Request | Expected |
|---|---|---|---|
| E2E-201 | Insufficient balance | `{ amount: 999999999999 }` | status: 409, errorCode: INSUFFICIENT_BALANCE |

## External Service Errors (503)

| ID | Description | Request | Expected |
|---|---|---|---|
| E2E-301 | Bank API timeout | `{ amount: 1000 }` | status: 503, errorCode: EXTERNAL_SERVICE_FAILURE |

> **Note:** 503 errors can be out of scope for E2E testing as they depend on external services.
> This scenario is already covered by integration tests. While WireMock could be used to mock external dependencies, that approach would no longer qualify as true E2E testing.
