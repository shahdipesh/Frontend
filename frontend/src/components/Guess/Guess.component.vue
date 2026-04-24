<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { io } from "socket.io-client";
import Button from 'primevue/button'
import axios from "axios";
import socket from '../../router/socket'
import { useRouter } from 'vue-router'
import LeaderBoard from "../LeaderBoard/LeaderBoard.vue";
const router = useRouter()

let isImposter = ref(false)
let word = ref('')
let hintForImposter = ref('')
let isTurnToGuess = ref(false);
let isVotingStarted = ref(false)
let isVotingEnded = ref(false)
let msg = ref('')
let isOwner = ref(false)
let userId = ref('NULL')
let whoseTurn = ref('')
let players = ref([])
let filteredPlayers = ref()
let guessed = ref(false)
let hasAlreadyVoted = ref(false)
const backendUrl = import.meta.env.VITE_BACKEND_URL

let handleVisibility = null;

onMounted(() => {
    const gameId = localStorage.getItem('gameId')
    const userId = localStorage.getItem('userId')
    if (gameId && userId) {
        socket.emit('JOIN_GAME', { gameId, userId })
    }

    axios.get(`${backendUrl}/game/hasAlreadyVoted`, {
        params: { userId, gameId }
    }).then(res => {
        if (res.data.msg) {
            hasAlreadyVoted.value = true
            isVotingStarted.value = res.data.isVotingStarted
            isVotingEnded.value = res.data.isVotingEnded
        }
    })

    axios.get(`${backendUrl}/isOwner`, {
        params: { userId, gameId }
    }).then(res => {
        if (res.data.isOwner) {
            isOwner.value = true
        }
    })

    axios.get(`${backendUrl}/game/getPlayers`, {
        params: { gameId }
    }).then(res => {
        let userId = localStorage.getItem('userId')
        if (res.status === 200) {
            players.value = res.data.players
            filteredPlayers.value = res.data.players.filter(p => {
                return p.userId != userId
            })
        }
    })

    axios.post(`${backendUrl}/game/whoseTurn`, {
        gameId: localStorage.getItem('gameId'),
        userId: localStorage.getItem('userId')
    }).then(res => {
        let name = res.data.name;
        let id = res.data.userId;
        whoseTurn.value = name
        if (id === localStorage.getItem('userId')) {
            isTurnToGuess.value = true
        }
    })

    axios.get(`${backendUrl}/game/isVotingStarted?gameId=${gameId}`)
        .then(res => {
            if (res.data.msg === "YES") {
                isVotingStarted.value = true
            } else {
                isVotingStarted.value = false
            }
        })

    handleVisibility = () => {
        if (!document.hidden) {
            router.push('/start-game');
        }
    };

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
        isVotingStarted.value = true
    })

    socket.on('PLAY_AGAIN', () => {
        router.push('/join-room')
    })

    socket.on('ALL_VOTED', () => {
        isVotingEnded.value = true
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

let submitImposterGuess = (imposterId) => {
    axios.post(`${backendUrl}/game/guessImposter`, {
        gameId: localStorage.getItem('gameId'),
        userId: localStorage.getItem('userId'),
        guessedImposterId: imposterId
    }).then(res => {
        if (res.data.msg === localStorage.getItem('userId')) {
            filteredPlayers.value = filteredPlayers.value.filter(p => {
                return p.userId != imposterId
            })
        }
        guessed.value = true;
    }).catch(e => {
        console.log(e)
    })
    guessed.value = true
}

</script>

<template>
    <div class="guess-page">
        <div class="guess-content flex flex-column gap-3">
        <LeaderBoard :players="players"></LeaderBoard>
        <span class="guess-card flex flex-column gap-3" v-if="isVotingStarted">
            {{ msg }}
            <div style="font-size: 20px;" v-if="isVotingStarted">
                Vote For Imposter:
            </div>
            <Button v-if="!guessed && !isVotingEnded && !hasAlreadyVoted" v-for="(p, index) in filteredPlayers"
                :key="index" :label="p.playerName || 'Player'" @click="submitImposterGuess(p.userId)" />
        </span>
        <Button v-if="isVotingEnded && isOwner" label="Play Again" @click="playAgain" />
        <span class="guess-card flex flex-column gap-3" :style="isTurnToGuess ? {
            border: '2px solid #00ffd0',
            boxShadow: '0 0 20px rgba(0,255,200,0.8)',
            background: 'rgba(0,255,200,0.08)',
            borderRadius: '12px',
            padding: '10px',
            transition: 'all 0.3s ease'
        } : {}" v-else>
            <div v-if="!isVotingStarted">
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
            </div>
        </span>
        </div>
    </div>
</template>

<style scoped>
.guess-page {
    min-height: 100vh;
    padding: 16px;
}

.guess-content {
    max-width: 760px;
    margin: 0 auto;
}

.guess-card {
    width: 100%;
    overflow-wrap: anywhere;
}

@media (max-width: 768px) {
    .guess-page {
        padding: 12px;
    }

    .guess-content :deep(.p-button) {
        width: 100%;
    }
}
</style>