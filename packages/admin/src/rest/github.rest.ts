import type {GitHubRelease} from '../types/github.types';

const GITHUB_API_JUNO_URL = 'https://api.github.com/repos/buildwithjuno/juno';

const GITHUB_API_HEADERS: RequestInit = {
  headers: {
    accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  }
};

export const githubLastRelease = async (apiUrl: string): Promise<GitHubRelease | undefined> => {
  const response = await fetch(`${apiUrl}/releases/latest`, GITHUB_API_HEADERS);

  if (!response.ok) {
    return undefined;
  }

  return response.json();
};

export const githubJunoLastRelease = (): Promise<GitHubRelease | undefined> =>
  githubLastRelease(GITHUB_API_JUNO_URL);

export const githubJunoReleases = async (): Promise<GitHubRelease[] | undefined> => {
  const response = await fetch(`${GITHUB_API_JUNO_URL}/releases`, GITHUB_API_HEADERS);

  if (!response.ok) {
    return undefined;
  }

  return response.json();
};
