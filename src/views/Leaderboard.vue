<template>
  <LeagueTable
    title="League Standings"
    :headers="[
      { name: 'Team Name', class: '' },
      { name: 'MP', class: 'tw-85' },
      { name: 'GD', class: 'hide-desktop' },
      { name: 'GF', class: 'hide-mobile tw-85 ' },
      { name: 'GA', class: 'hide-mobile tw-100 ' },
      { name: 'Points', class: 'tw-85' }
    ]"
    :data="teams"
    type="standings"
    :loading="loading"
  />
</template>

<script>
import LeagueTable from '@/components/LeagueTable.vue';
import LeagueService from '@/services/LeagueService.js';

export default {
  name: 'Leader',
  components: {
    LeagueTable
  },
  data() {
    return {
      teams: [],
      loading: true
    };
  },
  async created() {
    const leagueService = new LeagueService();
    await leagueService.fetchData();
    this.loading = false;
    this.teams = leagueService.getLeaderboard();
  }
};
</script>
