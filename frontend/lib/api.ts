const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function fetcher<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' })
  if (res.status === 429) throw new Error('API_RATE_LIMIT')
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const getMatchesToday = (leagueId?: number, date?: string) => {
  const params = new URLSearchParams()
  if (leagueId) params.set('league', String(leagueId))
  if (date) params.set('date', date)
  const q = params.toString()
  return fetcher(`/matches/today${q ? `?${q}` : ''}`)
}

export const getStandings = (leagueId: number) =>
  fetcher(`/leagues/${leagueId}/standings`)

export const getTopScorers = (leagueId: number) =>
  fetcher(`/leagues/${leagueId}/top-scorers`)

export const searchTeams = (name: string) =>
  fetcher(`/teams/search?name=${encodeURIComponent(name)}`)

export const searchPlayers = (name: string) =>
  fetcher(`/players/search?name=${encodeURIComponent(name)}`)
