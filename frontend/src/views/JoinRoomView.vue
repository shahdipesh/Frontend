<script setup>
import JoinRoomComponent from '../components/JoinRoom/JoinRoomComponent.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const roomName = ref(route.query.roomName)

onMounted(()=>{
  let room = localStorage.getItem('gameId')
  if(room){
    roomName.value = room
  }
})
</script>

<template>
  <JoinRoomComponent v-model="roomName"/>
</template>
