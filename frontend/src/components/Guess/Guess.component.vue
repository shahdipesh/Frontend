<script setup>
import { onMounted, ref } from "vue";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
let isImposter= ref('false')

socket.on('IMPOSTER', () => {
    isImposter=true;
});

</script>

<template>
    <h1>{{ isImposter ? "You are imposter": "You are not the imposter" }}</h1>
</template>