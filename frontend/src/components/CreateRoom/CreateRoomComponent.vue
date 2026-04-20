<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import axios from 'axios'
import './CreateRoomComponent.css'

const router = useRouter()

const roomName = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const createdRoomCode = ref('')
const playerName = ref('')
const numPlayers = ref();
const backendUrl = import.meta.env.VITE_BACKEND_URL

import getOrCreateUserId from '@/utils/userUtils'

const canSubmit = computed(() => roomName.value.trim().length > 0 && !isLoading.value)

async function createRoom() {
  errorMessage.value = ''
  createdRoomCode.value = ''

  const name = roomName.value.trim()
  const userId = getOrCreateUserId()

  if (!roomName.value || !playerName.value || !numPlayers.value) {
    errorMessage.value = 'Please fill all the fields'
    return
  }

  isLoading.value = true
  try {
    const response = await axios.post(`${backendUrl}/createRoom`, { userId, playerName: playerName.value, gameId: name, numPlayers: numPlayers.value })
    if (response.status == '200') {
      localStorage.setItem('gameId', name);
      localStorage.setItem('playerName', response.data.playerName)
      const userId = getOrCreateUserId()
      axios.post(`${backendUrl}/joinRoom`, {
        gameId: name,
        userId,
        playerName: response.data.playerName
      }).then(res => {
        if (res.data.msg != "Already full") {
          router.push({ name: 'game' })
        } else {
          alert("ALREADY FULL")
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      errorMessage.value = response.data.msg
    }
  } catch (err) {
    errorMessage.value = 'Failed to create room. Please try again.'
    // Keep details in console for debugging during development.
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

function goToJoinRoom(name) {
  router.push({ name: 'join-room', query: { roomName: name, playerName: playerName } })
}

onMounted(() => {
  let pName = localStorage.getItem('playerName')
  if (pName) {
    playerName.value = pName
  }
})
</script>

<template>
  <div class="create-room-page container flex flex-column gap-3">
    <h1>Create Room</h1>
    <InputText v-model="playerName" placeholder="Your Name" />
    <InputText v-model="roomName" placeholder="Room Name" />
    <InputText type="number" v-model="numPlayers" placeholder="Number of Players" />

    <div class="flex gap-2">
      <Button label="Create" :disabled="!canSubmit" :loading="isLoading" @click="createRoom" />
      <Button label="Back" severity="secondary" @click="router.push('/')" />
    </div>

    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <div v-if="createdRoomCode" class="created">
      <div class="created-label">Room created</div>
      <InputText required :modelValue="playerName" readonly />
      <InputText required :modelValue="createdRoomCode" readonly />
      <Button label="Join this room" class="mt-2" @click="goToJoinRoom" />
    </div>
  </div>
</template>
