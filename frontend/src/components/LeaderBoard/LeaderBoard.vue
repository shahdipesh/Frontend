
<script setup>
import './LeaderBoard.css'

defineProps({
  players: Array
})
</script>

<template class="container">
    <div class="leaderboard-wrapper">
      <h1>Leader Board</h1>
      <div class="leaderBoardContainer">
        {{ players.map(p=>{
            return (p.playerName+": "+p.score)
        }) }}
      </div>
    </div>
  </template>