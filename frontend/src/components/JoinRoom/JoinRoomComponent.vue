<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import './JoinRoomComponent.css'
import axios from 'axios'
import getOrCreateUserId from '@/utils/userUtils'
const router = useRouter()
const roomName = defineModel('roomName')
const playerName = defineModel('playerName')
const backendUrl = import.meta.env.VITE_BACKEND_URL

const joinRoom = (playerName,roomName) => {
  localStorage.setItem('gameId', roomName);
  localStorage.setItem('playerName', playerName);
  const userId = getOrCreateUserId()
  axios.post(`${backendUrl}/joinRoom`, {
    gameId: roomName,
    userId,
    playerName
  }).then(res => {
    if (res.data.msg != "Already full") {
      router.push({ name: 'game' })
    }else{
      alert("ALREADY FULL")
    }
  }).catch(err => {
    console.log(err)
  })
}

</script>

<template>
  <div class="container flex flex-column gap-3">
    <h1>Join Room</h1>
    <InputText required v-model="playerName" placeholder="Your name" />
    <InputText required v-model="roomName" placeholder="Room Name" />
    <Button label="Join" @click="joinRoom(playerName,roomName)" />
    <Button label="Back" severity="secondary" @click="router.push('/')" />
  </div>
</template>