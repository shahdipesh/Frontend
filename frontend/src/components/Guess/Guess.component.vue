<script setup>
import { onMounted, onUnmounted, ref } from "vue";
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
let userId = ref('NULL')
let whoseTurn = ref('')
const backendUrl = import.meta.env.VITE_BACKEND_URL

let handleVisibility = null;

onMounted(() => {
    const gameId = localStorage.getItem('gameId')
    const userId = localStorage.getItem('userId')
    if (gameId && userId) {
        socket.emit('JOIN_GAME', { gameId, userId })
    }

    axios.get(`${backendUrl}/isOwner`, {
        params: { userId, gameId }
    }).then(res => {
        if (res.data.isOwner) {
            isOwner.value = true
        }
    })

    axios.post(`${backendUrl}/game/whoseTurn`, {
        gameId: localStorage.getItem('gameId'),
        userId: localStorage.getItem('userId')
    }).then(res => {
        let name = res.data.name;
        let id = res.data.name;
        whoseTurn.value = name
        if (id === localStorage.getItem('userId')) {
            isTurnToGuess.value = true
        }
    })

    handleVisibility = () => {
        if (!document.hidden) {
            router.push('/start-game');
        }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    socket.on('PLAYER_TURN', ({ playerTurnName }) => {
        whoseTurn.value = playerTurnName
    })

    socket.on('IMPOSTER', ({ hint }) => {
        isImposter.value = true
        hintForImposter.value = hint
    })

    socket.on('WORD', ({ wordToGuess }) => {
        word.value = wordToGuess.word
    })

    socket.on('YOUR_TURN', () => {
        isTurnToGuess.value = true
    })

    socket.on('DISCONNECT', () => {
        router.push('/join-room')
    })

    socket.on('ROUND_OVER', () => {
        msg.value = 'Roud over!. Guess the imposter'
        isGameOver.value = true
    })

    socket.on('PLAY_AGAIN', () => {
        router.push('/join-room')
    })
})

onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibility);
});

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
        <span class="container flex flex-column gap-3" :style="isTurnToGuess ? {
            border: '2px solid #00ffd0',
            boxShadow: '0 0 20px rgba(0,255,200,0.8)',
            background: 'rgba(0,255,200,0.08)',
            borderRadius: '12px',
            padding: '10px',
            transition: 'all 0.3s ease'
        } : {}" v-else>
            <div v-if="isTurnToGuess" style="font-size: 0.9rem; color: #00ffd0; font-weight: 600;">
                🔥 YOUR TURN
            </div>
            <div v-else style="font-size: 0.9rem; color: #00ffd0; font-weight: 600;">
                {{ `${whoseTurn}'s turn to Give Hint` }}
            </div>
            {{ isImposter ? `You are the imposter.` : `Your word is: ${word}` }}
            <br><i style="font-size: 0.8rem; opacity: 0.7;">
                {{ isImposter ? `Hint: ${hintForImposter}` : '' }}
            </i>
            <Button v-if="isTurnToGuess" label="Guess" @click="guess" />
        </span>
    </h1>
</template>