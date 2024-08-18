/**
 * 
 *  THIS IS A TESTING FILE. YOU CAN FREELY MODIFY THE CODE BELOW IN ORDER TO TEST YOUR WORK.
 *  PLEASE DON´T CHANGE THE INTERFACE OF leagueService.js METHODS
 *
 */

require('jest-fetch-mock').enableMocks();
fetchMock.dontMock();

import LeagueService from '../src/services/LeagueService';
import ApiService from '../src/services/ApiService';

beforeAll(() => {
  global.localStorage = {
    store: {},
    getItem(key) {
      return this.store[key] || null;
    },
    setItem(key, value) {
      this.store[key] = value.toString();
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    }
  };
});

describe('laderboard', () => {
  let leagueService;

  beforeEach(() => {
    leagueService = new LeagueService();
  });

  test('check-fetch-matches', async () => {
    const mockToken = 'mocked_token';
    const mockResponse = {
      success: true,
      matches: [
        {
          matchDate: Date.now(),
          stadium: 'Maracanã',
          homeTeam: 'Brazil',
          awayTeam: 'France',
          matchPlayed: true,
          homeTeamScore: 2,
          awayTeamScore: 1
        }
      ]
    };

    fetch.mockResponseOnce(JSON.stringify(mockResponse));
    const matches = await leagueService.fetchMatches(mockToken);

    expect(matches.length).toBe(6);
    expect(matches[0].homeTeam).toBe('Brazil');
  });

  test('check-fetch-data', async () => {
    const mockToken = 'mocked_token';
    const mockMatches = [
      {
        matchDate: Date.now(),
        stadium: 'Maracanã',
        homeTeam: 'Brazil',
        awayTeam: 'France',
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 1
      }
    ];

    jest.spyOn(ApiService, 'getToken').mockReturnValue(mockToken);
    jest.spyOn(leagueService, 'fetchMatches').mockResolvedValue(mockMatches);
    jest.spyOn(leagueService, 'setMatches');

    await leagueService.fetchData();

    expect(ApiService.getToken).toHaveBeenCalled();
    expect(leagueService.fetchMatches).toHaveBeenCalledWith(mockToken);
    expect(leagueService.setMatches).toHaveBeenCalledWith(mockMatches);
  });

  test('check-leaderboard-teams', async () => {
    const singleMatch = [
      {
        matchDate: Date.now(),
        stadium: 'Maracanã',
        homeTeam: 'Brazil',
        awayTeam: 'France',
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 1
      }
    ];
    leagueService.setMatches(singleMatch);

    const leaderboard = leagueService.getLeaderboard();

    const brazilTeam = leaderboard[0];
    expect(brazilTeam.team).toBe('Brazil');
    expect(brazilTeam.mp).toBe(1);
    expect(brazilTeam.gf).toBe(2);
    expect(brazilTeam.ga).toBe(1);
    expect(brazilTeam.gd).toBe(1);
    expect(brazilTeam.points).toBe(3);

    const franceTeam = leaderboard[1];
    expect(franceTeam.team).toBe('France');
    expect(franceTeam.mp).toBe(1);
    expect(franceTeam.gf).toBe(1);
    expect(franceTeam.ga).toBe(2);
    expect(franceTeam.gd).toBe(-1);
    expect(franceTeam.points).toBe(0);
  });

  test('check-leaderboard-multiple-matches', async () => {
    const multipleMatches = [
      {
        matchDate: Date.now(),
        stadium: 'Maracanã',
        homeTeam: 'Brazil',
        awayTeam: 'France',
        matchPlayed: true,
        homeTeamScore: 3,
        awayTeamScore: 0
      },
      {
        matchDate: Date.now(),
        stadium: 'Wembley',
        homeTeam: 'England',
        awayTeam: 'Germany',
        matchPlayed: true,
        homeTeamScore: 1,
        awayTeamScore: 1
      },
      {
        matchDate: Date.now(),
        stadium: 'Allianz Arena',
        homeTeam: 'Germany',
        awayTeam: 'Brazil',
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 2
      },
      {
        matchDate: Date.now(),
        stadium: 'Stade de France',
        homeTeam: 'France',
        awayTeam: 'England',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 2
      }
    ];
    leagueService.setMatches(multipleMatches);

    const leaderboard = leagueService.getLeaderboard();

    const brazilTeam = leaderboard.find((team) => team.team === 'Brazil');
    expect(brazilTeam).toBeDefined();
    expect(brazilTeam.mp).toBe(2);
    expect(brazilTeam.gf).toBe(5);
    expect(brazilTeam.ga).toBe(2);
    expect(brazilTeam.gd).toBe(3);
    expect(brazilTeam.points).toBe(4);

    const germanyTeam = leaderboard.find((team) => team.team === 'Germany');
    expect(germanyTeam).toBeDefined();
    expect(germanyTeam.mp).toBe(2);
    expect(germanyTeam.gf).toBe(3);
    expect(germanyTeam.ga).toBe(3);
    expect(germanyTeam.gd).toBe(0);
    expect(germanyTeam.points).toBe(2);

    const englandTeam = leaderboard.find((team) => team.team === 'England');
    expect(englandTeam).toBeDefined();
    expect(englandTeam.mp).toBe(2);
    expect(englandTeam.gf).toBe(3);
    expect(englandTeam.ga).toBe(1);
    expect(englandTeam.gd).toBe(2);
    expect(englandTeam.points).toBe(4);

    const franceTeam = leaderboard.find((team) => team.team === 'France');
    expect(franceTeam).toBeDefined();
    expect(franceTeam.mp).toBe(2);
    expect(franceTeam.gf).toBe(0);
    expect(franceTeam.ga).toBe(5);
    expect(franceTeam.gd).toBe(-5);
    expect(franceTeam.points).toBe(0);
  });

  test('check-leaderboard-draws-only', async () => {
    const drawMatches = [
      {
        matchDate: Date.now(),
        stadium: 'Camp Nou',
        homeTeam: 'Spain',
        awayTeam: 'Italy',
        matchPlayed: true,
        homeTeamScore: 1,
        awayTeamScore: 1
      },
      {
        matchDate: Date.now(),
        stadium: 'San Siro',
        homeTeam: 'Italy',
        awayTeam: 'Spain',
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 2
      }
    ];
    leagueService.setMatches(drawMatches);

    const leaderboard = leagueService.getLeaderboard();

    const spainTeam = leaderboard.find((team) => team.team === 'Spain');
    expect(spainTeam).toBeDefined();
    expect(spainTeam.mp).toBe(2);
    expect(spainTeam.gf).toBe(3);
    expect(spainTeam.ga).toBe(3);
    expect(spainTeam.gd).toBe(0);
    expect(spainTeam.points).toBe(2);

    const italyTeam = leaderboard.find((team) => team.team === 'Italy');
    expect(italyTeam).toBeDefined();
    expect(italyTeam.mp).toBe(2);
    expect(italyTeam.gf).toBe(3);
    expect(italyTeam.ga).toBe(3);
    expect(italyTeam.gd).toBe(0);
    expect(italyTeam.points).toBe(2);
  });

  test('check-leaderboard-wins-losses-draws', async () => {
    const mixedResultsMatches = [
      {
        matchDate: Date.now(),
        stadium: 'Bernabéu',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        matchPlayed: true,
        homeTeamScore: 3,
        awayTeamScore: 1
      },
      {
        matchDate: Date.now(),
        stadium: 'Camp Nou',
        homeTeam: 'Barcelona',
        awayTeam: 'Real Madrid',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 0
      },
      {
        matchDate: Date.now(),
        stadium: 'Old Trafford',
        homeTeam: 'Manchester United',
        awayTeam: 'Chelsea',
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 1
      }
    ];
    leagueService.setMatches(mixedResultsMatches);

    const leaderboard = leagueService.getLeaderboard();

    const realMadridTeam = leaderboard.find(
      (team) => team.team === 'Real Madrid'
    );
    expect(realMadridTeam).toBeDefined();
    expect(realMadridTeam.mp).toBe(2);
    expect(realMadridTeam.gf).toBe(3);
    expect(realMadridTeam.ga).toBe(1);
    expect(realMadridTeam.gd).toBe(2);
    expect(realMadridTeam.points).toBe(4);

    const barcelonaTeam = leaderboard.find((team) => team.team === 'Barcelona');
    expect(barcelonaTeam).toBeDefined();
    expect(barcelonaTeam.mp).toBe(2);
    expect(barcelonaTeam.gf).toBe(1);
    expect(barcelonaTeam.ga).toBe(3);
    expect(barcelonaTeam.gd).toBe(-2);
    expect(barcelonaTeam.points).toBe(1);

    const manUnitedTeam = leaderboard.find(
      (team) => team.team === 'Manchester United'
    );
    expect(manUnitedTeam).toBeDefined();
    expect(manUnitedTeam.mp).toBe(1);
    expect(manUnitedTeam.gf).toBe(2);
    expect(manUnitedTeam.ga).toBe(1);
    expect(manUnitedTeam.gd).toBe(1);
    expect(manUnitedTeam.points).toBe(3);

    const chelseaTeam = leaderboard.find((team) => team.team === 'Chelsea');
    expect(chelseaTeam).toBeDefined();
    expect(chelseaTeam.mp).toBe(1);
    expect(chelseaTeam.gf).toBe(1);
    expect(chelseaTeam.ga).toBe(2);
    expect(chelseaTeam.gd).toBe(-1);
    expect(chelseaTeam.points).toBe(0);
  });
});

describe('LeaderboardService Tests with Tiebreakers', () => {
  let leagueService;

  beforeEach(() => {
    leagueService = new LeagueService();
  });

  test('check-leaderboard-tiebreaker-goal-difference', async () => {
    const matches = [
      {
        homeTeam: 'Brazil',
        awayTeam: 'Serbia',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 0
      },
      {
        homeTeam: 'Switzerland',
        awayTeam: 'Serbia',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 2
      },
      {
        homeTeam: 'Serbia',
        awayTeam: 'Cameroon',
        matchPlayed: true,
        homeTeamScore: 1,
        awayTeamScore: 1
      },
      {
        homeTeam: 'Brazil',
        awayTeam: 'Switzerland',
        matchPlayed: true,
        homeTeamScore: 4,
        awayTeamScore: 2
      },
      {
        homeTeam: 'Brazil',
        awayTeam: 'Cameroon',
        matchPlayed: false,
        homeTeamScore: null,
        awayTeamScore: null
      },
      {
        homeTeam: 'Switzerland',
        awayTeam: 'Cameroon',
        matchPlayed: false,
        homeTeamScore: null,
        awayTeamScore: null
      }
    ];
    leagueService.setMatches(matches);

    const leaderboard = leagueService.getLeaderboard();

    expect(leaderboard[0].team).toBe('Serbia');
    expect(leaderboard[1].team).toBe('Brazil');
  });

  test('check-leaderboard-tiebreaker-head-to-head', async () => {
    const matches = [
      {
        homeTeam: 'Brazil',
        awayTeam: 'Serbia',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 0
      },
      {
        homeTeam: 'Switzerland',
        awayTeam: 'Serbia',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 2
      },
      {
        homeTeam: 'Serbia',
        awayTeam: 'Cameroon',
        matchPlayed: true,
        homeTeamScore: 1,
        awayTeamScore: 2
      },
      {
        homeTeam: 'Brazil',
        awayTeam: 'Switzerland',
        matchPlayed: true,
        homeTeamScore: 4,
        awayTeamScore: 2
      },
      {
        homeTeam: 'Brazil',
        awayTeam: 'Cameroon',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 1
      },
      {
        homeTeam: 'Switzerland',
        awayTeam: 'Cameroon',
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 2
      }
    ];
    leagueService.setMatches(matches);

    const leaderboard = leagueService.getLeaderboard();

    expect(leaderboard[0].team).toBe('Cameroon');
    expect(leaderboard[1].team).toBe('Brazil');
    expect(leaderboard[2].team).toBe('Serbia');
  });

  test('check-leaderboard-tiebreaker-mixed-scenarios', async () => {
    const matches = [
      {
        homeTeam: 'Brazil',
        awayTeam: 'Serbia',
        matchPlayed: true,
        homeTeamScore: 1,
        awayTeamScore: 0
      },
      {
        homeTeam: 'Switzerland',
        awayTeam: 'Serbia',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 2
      },
      {
        homeTeam: 'Serbia',
        awayTeam: 'Cameroon',
        matchPlayed: true,
        homeTeamScore: 1,
        awayTeamScore: 1
      },
      {
        homeTeam: 'Brazil',
        awayTeam: 'Switzerland',
        matchPlayed: true,
        homeTeamScore: 2,
        awayTeamScore: 3
      },
      {
        homeTeam: 'Brazil',
        awayTeam: 'Cameroon',
        matchPlayed: true,
        homeTeamScore: 0,
        awayTeamScore: 0
      },
      {
        homeTeam: 'Switzerland',
        awayTeam: 'Cameroon',
        matchPlayed: false,
        homeTeamScore: null,
        awayTeamScore: null
      }
    ];
    leagueService.setMatches(matches);

    const leaderboard = leagueService.getLeaderboard();

    expect(leaderboard[0].team).toBe('Brazil');
    expect(leaderboard[1].team).toBe('Serbia');
  });
});
