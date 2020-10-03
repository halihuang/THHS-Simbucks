<template>
  <v-app>
    <Nav/>
    <v-content>
        <v-container fluid>
          <router-view/>
        </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Nav from './components/Nav'
export default {
  name: 'App',
  components: {
    Nav
  },
};
console.log();
</script>
