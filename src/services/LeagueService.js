import ApiService from './ApiService';
import { API_BASE_URL } from './ApiService.js';
class LeagueService {
  constructor() {
    this.matches = [];
    this.baseUrl = `${API_BASE_URL}/v1`;
  }

  /**
   * Sets the match schedule.
   * Match schedule will be given in the following form:
   * [
   *      {
   *          matchDate: [TIMESTAMP],
   *          stadium: [STRING],
   *          homeTeam: [STRING],
   *          awayTeam: [STRING],
   *          matchPlayed: [BOOLEAN],
   *          homeTeamScore: [INTEGER],
   *          awayTeamScore: [INTEGER]
   *      },
   *      {
   *          matchDate: [TIMESTAMP],
   *          stadium: [STRING],
   *          homeTeam: [STRING],
   *          awayTeam: [STRING],
   *          matchPlayed: [BOOLEAN],
   *          homeTeamScore: [INTEGER],
   *          awayTeamScore: [INTEGER]
   *      }
   * ]
   *
   * @param {Array} matches List of matches.
   */
  setMatches(matches) {
    this.matches = matches;
  }

  /**
   * Returns the full list of matches.
   *
   * @returns {Array} List of matches.
   */
  getMatches() {
    return this.matches;
  }

  /**
   * Returns the leaderboard in a form of a list of JSON objecs.
   *
   * [
   *      {
   *          teamName: [STRING]',
   *          matchesPlayed: [INTEGER],
   *          goalsFor: [INTEGER],
   *          goalsAgainst: [INTEGER],
   *          points: [INTEGER]
   *      },
   * ]
   *
   * @returns {Array} List of teams representing the leaderboard.
   */
  getLeaderboard() {
    const teams = this.matches.reduce((acc, match) => {
      const { homeTeam, awayTeam, homeTeamScore, awayTeamScore, matchPlayed } =
        match;

      const homeTeamData = this.initializeTeam(acc[homeTeam] || {}, homeTeam);
      const awayTeamData = this.initializeTeam(acc[awayTeam] || {}, awayTeam);

      const updatedTeams = matchPlayed
        ? this.updateStats({
            homeTeamData,
            awayTeamData,
            homeTeamScore,
            awayTeamScore
          })
        : { homeTeamData, awayTeamData };

      return {
        ...acc,
        [homeTeam]: updatedTeams.homeTeamData,
        [awayTeam]: updatedTeams.awayTeamData
      };
    }, {});

    return this.sortAndFormatLeaderboard(teams);
  }

  initializeTeam(teamData, teamName) {
    return {
      name: teamName,
      matchesPlayed: teamData.matchesPlayed || 0,
      goalsFor: teamData.goalsFor || 0,
      goalsAgainst: teamData.goalsAgainst || 0,
      points: teamData.points || 0
    };
  }

  updateStats({ homeTeamData, awayTeamData, homeTeamScore, awayTeamScore }) {
    const updatedHomeTeamData = {
      ...homeTeamData,
      matchesPlayed: homeTeamData.matchesPlayed + 1,
      goalsFor: homeTeamData.goalsFor + homeTeamScore,
      goalsAgainst: homeTeamData.goalsAgainst + awayTeamScore
    };

    const updatedAwayTeamData = {
      ...awayTeamData,
      matchesPlayed: awayTeamData.matchesPlayed + 1,
      goalsFor: awayTeamData.goalsFor + awayTeamScore,
      goalsAgainst: awayTeamData.goalsAgainst + homeTeamScore
    };

    const updatedPoints = this.calculatePoints({
      homeTeamScore,
      awayTeamScore
    });

    return {
      homeTeamData: {
        ...updatedHomeTeamData,
        points: updatedHomeTeamData.points + updatedPoints.home
      },
      awayTeamData: {
        ...updatedAwayTeamData,
        points: updatedAwayTeamData.points + updatedPoints.away
      }
    };
  }

  calculatePoints({ homeTeamScore, awayTeamScore }) {
    if (homeTeamScore > awayTeamScore) {
      return { home: 3, away: 0 };
    } else if (homeTeamScore < awayTeamScore) {
      return { home: 0, away: 3 };
    } else {
      return { home: 1, away: 1 };
    }
  }

  sortAndFormatLeaderboard(teams) {
    return Object.values(teams)
      .sort((teamA, teamB) => this.compareTeams(teamA, teamB))
      .map((team) => this.formatTeamStats(team));
  }

  compareTeams(teamA, teamB) {
    if (teamA.points !== teamB.points) {
      return teamB.points - teamA.points;
    }

    const headToHeadPoints = this.getHeadToHeadPoints(teamA.name, teamB.name);
    if (headToHeadPoints[teamA.name] !== headToHeadPoints[teamB.name]) {
      return headToHeadPoints[teamB.name] - headToHeadPoints[teamA.name];
    }

    const goalDifferenceA = teamA.goalsFor - teamA.goalsAgainst;
    const goalDifferenceB = teamB.goalsFor - teamB.goalsAgainst;
    if (goalDifferenceA !== goalDifferenceB) {
      return goalDifferenceB - goalDifferenceA;
    }

    if (teamA.goalsFor !== teamB.goalsFor) {
      return teamB.goalsFor - teamA.goalsFor;
    }

    return teamA.name.localeCompare(teamB.name);
  }

  getHeadToHeadPoints(teamAName, teamBName) {
    let teamAPoints = 0;
    let teamBPoints = 0;

    this.matches.forEach((match) => {
      if (
        (match.homeTeam === teamAName && match.awayTeam === teamBName) ||
        (match.homeTeam === teamBName && match.awayTeam === teamAName)
      ) {
        if (match.homeTeam === teamAName) {
          if (match.homeTeamScore > match.awayTeamScore) {
            teamAPoints += 3;
          } else if (match.homeTeamScore < match.awayTeamScore) {
            teamBPoints += 3;
          } else {
            teamAPoints += 1;
            teamBPoints += 1;
          }
        } else if (match.homeTeam === teamBName) {
          if (match.homeTeamScore > match.awayTeamScore) {
            teamBPoints += 3;
          } else if (match.homeTeamScore < match.awayTeamScore) {
            teamAPoints += 3;
          } else {
            teamAPoints += 1;
            teamBPoints += 1;
          }
        }
      }
    });

    return {
      [teamAName]: teamAPoints,
      [teamBName]: teamBPoints
    };
  }

  formatTeamStats(team) {
    return {
      team: team.name,
      mp: team.matchesPlayed,
      gf: team.goalsFor,
      ga: team.goalsAgainst,
      gd: team.goalsFor - team.goalsAgainst,
      points: team.points
    };
  }

  async fetchData() {
    try {
      let token = ApiService.getToken();

      if (!token) {
        token = await ApiService.fetchAccessToken();
        if (!token) {
          throw new Error('Failed to retrieve access token');
        }
      }

      const matches = await this.fetchMatches(token);
      this.setMatches(matches);
    } catch (error) {
      console.error('Error fetching data:', error);
      ApiService.clearToken();
    }
  }

  async fetchMatches(token) {
    try {
      const matchesResponse = await fetch(`${API_BASE_URL}/v1/getAllMatches`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (matchesResponse.status === 401) {
        const newToken = await ApiService.fetchAccessToken();
        if (!newToken) {
          throw new Error('Failed to retrieve access token after 401');
        }
        return await this.fetchMatches(newToken);
      }

      const matchesData = await matchesResponse.json();

      if (!matchesData.success) {
        throw new Error('Failed to retrieve matches');
      }

      return matchesData.matches;
    } catch (error) {
      throw new Error('Error fetching matches:', error);
    }
  }
}

export default LeagueService;
