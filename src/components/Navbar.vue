<template>
  <header class="header">
    <div class="logo">
      <img src="/images/logo.svg" alt="League Web UI logo" />
    </div>
    <nav class="nav">
      <router-link to="/schedule" class="nav-link">
        <img src="/images/schedule.png" alt="Schedule Icon" class="nav-icon" />
        Schedule
      </router-link>
      <router-link to="/leaderboard" class="nav-link">
        <img
          src="/images/leaderboard.png"
          alt="Leaderboard Icon"
          class="nav-icon"
        />
        Leaderboard
      </router-link>
    </nav>
  </header>
</template>
