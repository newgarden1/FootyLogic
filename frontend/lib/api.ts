const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const getMatchesToday = (leagueId?: number) => {
  const q = leagueId ? `?league=${leagueId}` : ''
  return fetcher(`/matches/today${q}`)
}

export const getStandings = (leagueId: number, season = 2024) =>
  fetcher(`/leagues/${leagueId}/standings?season=${season}`)

export const getTopScorers = (leagueId: number, season = 2024) =>
  fetcher(`/leagues/${leagueId}/top-scorers?season=${season}`)

export const searchTeams = (name: string) =>
  fetcher(`/teams/search?name=${encodeURIComponent(name)}`)

export const searchPlayers = (name: string) =>
  fetcher(`/players/search?name=${encodeURIComponent(name)}`)
