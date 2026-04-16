<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import './JoinRoomComponent.css'
import axios from 'axios'
import getOrCreateUserId from '@/utils/userUtils'
const router = useRouter()
const model = defineModel()
const backendUrl = import.meta.env.VITE_BACKEND_URL

const joinRoom = (model) => {
  localStorage.setItem('gameId', model);
  const userId = getOrCreateUserId()
  localStorage.setItem('userId', userId)
  axios.post(`${backendUrl}/joinRoom`, {
    gameId: model,
    userId
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
    <InputText v-model="model" placeholder="Room Name" />
    <Button label="Join" @click="joinRoom(model)" />
    <Button label="Back" severity="secondary" @click="router.push('/')" />
  </div>
</template>