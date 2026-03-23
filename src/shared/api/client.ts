import axios from 'axios';

const ACCESS_TOKEN_KEY = 'access_token';

export const apiClient = axios.create({
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (typeof window !== 'undefined' && status === 401) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

type ApiFieldErrors = Record<string, string>;

interface ParsedApiError {
  status: number | null;
  code: string | null;
  message: string;
  details: unknown;
  fieldErrors: ApiFieldErrors;
}

function normalizeFieldName(path: Array<string | number>): string {
  const filtered = path.filter(
    (part) => part !== 'body' && part !== 'query' && part !== 'path',
  );

  return filtered.map(String).join('.');
}

function extractFastApiFieldErrors(detail: unknown): ApiFieldErrors {
  if (!Array.isArray(detail)) {
    return {};
  }

  const result: ApiFieldErrors = {};

  for (const item of detail) {
    const loc = Array.isArray(item?.loc) ? item.loc : [];
    const fieldName = normalizeFieldName(loc);
    const message =
      typeof item?.msg === 'string' ? item.msg : 'Invalid field value';

    if (fieldName && !result[fieldName]) {
      result[fieldName] = message;
    }
  }

  return result;
}

function getDefaultMessage(status: number | null): string {
  if (status === 401) {
    return 'Authentication required';
  }

  if (status === 403) {
    return 'You do not have access to this resource';
  }

  if (status === 404) {
    return 'Resource not found';
  }

  if (status === 422) {
    return 'Please check the entered data';
  }

  if (status !== null && status >= 500) {
    return 'Server error. Please try again later';
  }

  return 'Request failed';
}

export function parseApiErrorResponse(error: any): ParsedApiError {
  const status =
    typeof error?.response?.status === 'number' ? error.response.status : null;

  const data = error?.response?.data;
  const errorNode = data?.error;

  if (errorNode && typeof errorNode === 'object') {
    const details = errorNode.details;
    const fieldErrors =
      details && typeof details === 'object' && !Array.isArray(details)
        ? Object.fromEntries(
            Object.entries(details).filter(
              ([key, value]) =>
                typeof key === 'string' && typeof value === 'string',
            ),
          )
        : {};

    return {
      status,
      code: typeof errorNode.code === 'string' ? errorNode.code : null,
      message:
        typeof errorNode.message === 'string' && errorNode.message.trim()
          ? errorNode.message
          : getDefaultMessage(status),
      details,
      fieldErrors,
    };
  }

  if (typeof data?.detail === 'string') {
    return {
      status,
      code: null,
      message: data.detail,
      details: data.detail,
      fieldErrors: {},
    };
  }

  if (Array.isArray(data?.detail)) {
    const fieldErrors = extractFastApiFieldErrors(data.detail);

    return {
      status,
      code: null,
      message:
        Object.keys(fieldErrors).length > 0
          ? 'Please check the entered data'
          : getDefaultMessage(status),
      details: data.detail,
      fieldErrors,
    };
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return {
      status,
      code: null,
      message: error.message,
      details: null,
      fieldErrors: {},
    };
  }

  return {
    status,
    code: null,
    message: getDefaultMessage(status),
    details: null,
    fieldErrors: {},
  };
}

export function parseApiError(error: any): string {
  return parseApiErrorResponse(error).message;
}