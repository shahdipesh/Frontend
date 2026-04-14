<script setup>
import { io } from "socket.io-client";
import { onMounted, ref } from "vue";
let currentPlayers = ref(0);
const socket = io("http://localhost:3000");

onMounted(() => {
    let gameId = localStorage.getItem('gameId')
    let userId = localStorage.getItem('userId')
    socket.emit('JOIN_GAME', {
        gameId: gameId,
        userId: userId
    });

})

socket.on('CURRENT_PLAYERS_COUNT', ({ count }) => {
    currentPlayers.value = count
});

socket.on('START_GAME', () => {
    alert('Starting Game')
});
</script>

<template>
    <div class="container flex flex-column gap-3">
        <h1>Current Players: {{ currentPlayers }}</h1>

    </div>
</template>