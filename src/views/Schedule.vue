<template>
  <LeagueTable
    title="League Schedule"
    :headers="[
      { name: 'Date/Time', class: 'hide-mobile date-block' },
      { name: 'Stadium', class: 'hide-tablet pl-80' },
      { name: 'Home Team', class: 'home-team' },
      { name: '', class: '' },
      { name: 'Away Team', class: '' }
    ]"
    :data="matches"
    type="schedule"
    :loading="loading"
  />
</template>

<script>
import LeagueTable from '@/components/LeagueTable.vue';
import LeagueService from '@/services/LeagueService.js';

export default {
  name: 'Schedule',
  components: {
    LeagueTable
  },
  data() {
    return {
      matches: [],
      loading: true
    };
  },
  async created() {
    const leagueService = new LeagueService();
    await leagueService.fetchData();
    this.loading = false;
    this.matches = leagueService.getMatches();
  }
};
</script>
