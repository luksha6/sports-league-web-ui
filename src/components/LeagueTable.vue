<template>
  <div class="table-container" :class="type">
    <h2 class="table-heading">{{ title }}</h2>
    <table class="league-table">
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.name"
            :class="header.class"
          >
            {{ header.name }}
          </th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr>
          <td colspan="100%" class="text-center">Loading...</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="row in data" :key="row.id">
          <td v-if="type === 'standings'">
            <img :src="getFlagUrl(row.team)" :alt="row.team" class="flag" />
            {{ row.team }}
          </td>
          <td
            v-else
            class="hide-mobile date-block"
            v-html="formatDate(row.matchDate)"
          ></td>
          <td v-if="type === 'schedule'" class="hide-tablet pl-80">
            {{ row.stadium }}
          </td>
          <td v-if="type === 'schedule'" class="team-cell-rtl bolded p-0-m">
            {{ row.homeTeam }}
            <img
              :src="getFlagUrl(row.homeTeam)"
              :alt="row.homeTeam"
              class="flag"
            />
          </td>
          <td v-if="type === 'schedule'" class="bolded text-center">
            {{ getMatchScore(row) }}
          </td>
          <td v-if="type === 'schedule'" class="team-cell bolded p-0-m">
            <img
              :src="getFlagUrl(row.awayTeam)"
              :alt="row.awayTeam"
              class="flag"
            />
            {{ row.awayTeam }}
          </td>

          <td v-if="type === 'standings'" class="pl-15">{{ row.mp }}</td>
          <td v-if="type === 'standings'" class="hide-desktop">{{ row.gd }}</td>
          <td v-if="type === 'standings'" class="hide-mobile pl-15">
            {{ row.gf }}
          </td>
          <td v-if="type === 'standings'" class="hide-mobile pl-15">
            {{ row.ga }}
          </td>
          <td v-if="type === 'standings'" class="points pl-25">
            {{ row.points }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import FlagService from '@/services/FlagService.js';

export default {
  name: 'LeagueTable',
  props: {
    title: String,
    headers: Array,
    data: Array,
    type: String,
    loading: Boolean
  },
  methods: {
    getFlagUrl(countryName) {
      if (!countryName) return '';
      return FlagService.getFlagUrl(countryName);
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}.${month}.${year} <br /> ${hours}:${minutes}`;
    },
    getMatchScore(match) {
      return match.matchPlayed
        ? `${match.homeTeamScore} : ${match.awayTeamScore}`
        : '- : -';
    }
  }
};
</script>
