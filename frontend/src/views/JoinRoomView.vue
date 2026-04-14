<script setup>
import JoinRoomComponent from '../components/JoinRoom/JoinRoomComponent.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const roomName = ref(route.query.roomName || '')
</script>

<template>
  <JoinRoomComponent v-model="roomName"/>
</template>
