type ApiRouteContext = {
  params?: Promise<Record<string, string | string[]>> | Record<string, string | string[]>;
};

type ApiRouteHandler<Context extends ApiRouteContext = ApiRouteContext> = (
  request: Request,
  context: Context,
) => Response | Promise<Response>;

const sensitiveKeyPattern = /password|token|secret|cookie|authorization/i;

function stringify(value: unknown) {
  return JSON.stringify(value, null, 5);
}

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveKeyPattern.test(key) ? "[REDACTED]" : sanitize(item),
      ]),
    );
  }

  return value;
}

function parseText(text: string) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function readRequestBody(request: Request) {
  if (request.method === "GET" || request.method === "HEAD") {
    return null;
  }

  try {
    return parseText(await request.clone().text());
  } catch {
    return "[UNREADABLE_REQUEST_BODY]";
  }
}

async function readResponseBody(response: Response) {
  if (response.status === 204) {
    return null;
  }

  try {
    return parseText(await response.clone().text());
  } catch {
    return "[UNREADABLE_RESPONSE_BODY]";
  }
}

async function resolveParams(context: ApiRouteContext) {
  if (!context.params) return {};

  return await context.params;
}

export function withApiLogging<Context extends ApiRouteContext = ApiRouteContext>(
  handler: ApiRouteHandler<Context>,
): ApiRouteHandler<Context> {
  return async (request, context) => {
    const url = new URL(request.url);
    const requestParameter = {
      query: Object.fromEntries(url.searchParams.entries()),
      params: await resolveParams(context),
      body: await readRequestBody(request),
    };

    const response = await handler(request, context);
    const responseBody = await readResponseBody(response);

    console.info(
      [
        "==========",
        "",
        "[API 요청]",
        `- RESTful API: ${request.method}`,
        `- EndPoint: ${url.pathname}`,
        `- 요청 parameter: ${stringify(sanitize(requestParameter))}`,
        "",
        "[API 응답]",
        `- 응답 response: ${stringify(
          sanitize({
            status: response.status,
            body: responseBody,
          }),
        )}`,
        "==========",
      ].join("\n"),
    );

    return response;
  };
}
