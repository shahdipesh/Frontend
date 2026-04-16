<script setup>
import router from "@/router";
import socket from '../../router/socket'
import { onMounted, ref } from "vue";
let currentPlayers = ref(0);

onMounted(() => {
    let gameId = localStorage.getItem('gameId')
    let userId = localStorage.getItem('userId')
    if (gameId && userId){
        socket.emit('JOIN_GAME', {
            gameId: gameId,
            userId: userId
        });
    }

})

socket.on('CURRENT_PLAYERS_COUNT', ({ count }) => {
    currentPlayers.value = count
});

socket.on('START_GAME', () => {
    router.push({ name: 'start-game' })
});
</script>

<template>
    <div class="container flex flex-column gap-3">
        <h1>Current Players: {{ currentPlayers }}</h1>
    </div>
</template>