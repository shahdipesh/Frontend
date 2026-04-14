<script setup>
import Button from 'primevue/button'
import './HomeComponent.css'
import { useRouter } from 'vue-router'
const router = useRouter()

let joinRoom = () => {
    router.push('/join-room')
}

let createRoom = () => {
    router.push('/create-room')
}
</script>

<template>
   <div class="container">
    <div class="flex flex-column gap-3">
        <Button label="Create" @click="createRoom" />
        <Button label="Join" @click="joinRoom" />
    </div>
</div>

</template>