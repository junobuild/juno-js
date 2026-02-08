import {ApiGitHubFinalizeError, ApiGitHubInitError} from '../../errors';

export const initOAuth = async ({
  url
}: {
  url: string;
}): Promise<{success: {state: string}} | {error: unknown}> => {
  try {
    const result = await fetch(url, {
      credentials: 'include'
    });

    if (!result.ok) {
      return {error: new Error(`Failed to fetch ${url} (${result.status})`)};
    }

    const data: {state: string} = await result.json();
    return {success: data};
  } catch (error: unknown) {
    return {error: new ApiGitHubInitError({cause: error})};
  }
};

export const finalizeOAuth = async ({
  url,
  body
}: {
  url: string;
  body: {code: string | null; state: string | null};
}): Promise<{success: {token: string}} | {error: unknown}> => {
  try {
    const result = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });

    if (!result.ok) {
      return {error: new Error(`Failed to fetch ${url} (${result.status})`)};
    }

    const data: {token: string} = await result.json();
    return {success: data};
  } catch (error: unknown) {
    return {error: new ApiGitHubFinalizeError({cause: error})};
  }
};
