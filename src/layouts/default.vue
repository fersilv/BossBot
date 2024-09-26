<template>
  <template v-if="false">
    <Login />
  </template>
  <template v-else>
    <v-app>
      <v-main>
        <router-view />
      </v-main>
      <NavBar />
    </v-app>
  </template>
</template>

<script lang="ts" setup>
//
</script>
