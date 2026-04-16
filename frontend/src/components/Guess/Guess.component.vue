<script setup>
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import Button from 'primevue/button'
import axios from "axios";
import socket from '../../router/socket'
let isImposter = ref(false)
let word = ref('')
let isTurnToGuess = ref(false);
const backendUrl = import.meta.env.VITE_BACKEND_URL

onMounted(() => {
    const gameId = localStorage.getItem('gameId')
    const userId = localStorage.getItem('userId')
    if (gameId && userId) {
        socket.emit('JOIN_GAME', { gameId, userId })
    }

    // backend uses events.IMPOSTER; keep both just in case
    socket.on('IMPOSTER', () => {
        isImposter.value = true
    })

    socket.on('WORD', ({wordToGuess}) => {
        word.value = wordToGuess
    })

    socket.on('YOUR_TURN', () => {
        isTurnToGuess.value = true
    })

    socket.on('ROUND_OVER',()=>{
        alert("ROUND OVER")
    })
})

let guess = async()=>{
    axios.post(`${backendUrl}/game/guess`,{
        gameId: localStorage.getItem('gameId'),
        userId:localStorage.getItem('userId')
    }).then(res=>{
        if (res.status==200){
            isTurnToGuess.value = false; 
        }
    })
    .catch(e=>{
        alert(e)
    })
}

</script>

<template>
    <h1 class="container flex flex-column gap-3">
        {{ isImposter ? "You are the imposter" : `Your word is: ${word}`  }}
        <Button v-if="isTurnToGuess" label="Guess" @click="guess"/>
    </h1>
</template>