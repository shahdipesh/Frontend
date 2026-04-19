<script setup>
import JoinRoomComponent from '../components/JoinRoom/JoinRoomComponent.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
let roomName = ref(route.query.roomName)
let playerName = ref('')

onMounted(() => {
  let room = localStorage.getItem('gameId')
  let player = localStorage.getItem('playerName')
  if (room) {
    roomName.value = room
  }
  if (playerName) {
    playerName.value = player
  }
})
</script>

<template>
  <JoinRoomComponent v-model:roomName="roomName" v-model:playerName="playerName" />
</template>
