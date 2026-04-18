<script setup>
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
import Button from 'primevue/button'
import axios from "axios";
import socket from '../../router/socket'
import { useRouter } from 'vue-router'
const router = useRouter()

let isImposter = ref(false)
let word = ref('')
let hintForImposter = ref('')
let isTurnToGuess = ref(false);
let isGameOver = ref(false)
let msg = ref('')
let isOwner = ref(false)
let userId=ref('NULL')
const backendUrl = import.meta.env.VITE_BACKEND_URL

onMounted(() => {
    const gameId = localStorage.getItem('gameId')
    const userId = localStorage.getItem('userId')
    if (gameId && userId) {
        socket.emit('JOIN_GAME', { gameId, userId })
    }

    axios.get(`${backendUrl}/isOwner`,{
        params: { userId, gameId}
    }).then(res=>{
        if(res.data.isOwner){
            isOwner.value = true
        }
    })

    socket.on('IMPOSTER', ({hint}) => {
        isImposter.value = true
        hintForImposter.value = hint
    })

    socket.on('WORD', ({ wordToGuess }) => {
        word.value = wordToGuess.word
    })

    socket.on('YOUR_TURN', () => {
        isTurnToGuess.value = true
    })

    socket.on('DISCONNECT',()=>{
        router.push('/join-room')
    })

    socket.on('ROUND_OVER', () => {
        msg.value = 'GAME OVER!. GUESS WHO IS THE IMPOSTER'
        isGameOver.value = true
    })

    socket.on('PLAY_AGAIN', () => {
        router.push('/join-room')
    })
})

let guess = async () => {
    axios.post(`${backendUrl}/game/guess`, {
        gameId: localStorage.getItem('gameId'),
        userId: localStorage.getItem('userId')
    }).then(res => {
        if (res.status == 200) {
            isTurnToGuess.value = false;
        }
    }).catch(e => {
        res.send(e)
    })
}

let playAgain = async () => {
    axios.post(`${backendUrl}/game/restart`, {
        gameId: localStorage.getItem('gameId'),
        userId: localStorage.getItem('userId')
    }).then(res => {
        if (res.status == 200) {
            msg.value = ''
            router.push('/join-room')
        }
    }).catch(e => {
        res.send(e)
    })

}

</script>

<template>
    <h1 class="container flex flex-column gap-3">
        <span class="container flex flex-column gap-3" v-if="isGameOver">
            {{ msg }}
            <Button v-if="isGameOver && isOwner" label="Play Again" @click="playAgain" />
        </span>
        <span class="container flex flex-column gap-3" v-else>
            {{ isImposter ? `You are the imposter.` : `Your word is: ${word}` }}
            <br><i>{{ isImposter ? `Hint: ${hintForImposter}`: '' }}</i>
            <Button v-if="isTurnToGuess" label="Guess" @click="guess" />
        </span>
    </h1>
</template>