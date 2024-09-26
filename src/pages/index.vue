<template>
  <v-container>
    <div class="text-center">
      <v-progress-circular
        :model-value="value"
        :rotate="180"
        :size="100"
        :width="15"
        :color="getColor(value)"
      >
        {{ convertUmaDez(value) }}
      </v-progress-circular>
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      interval: null,
      value: 0,
    }
  },
  beforeUnmount () {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  mounted () {
    this.interval = setInterval(() => {
      if (this.value === 101) {
        clearInterval(this.interval)
        return
      }
      this.value += 1
    }, 50)
    document.title = "Dashboard | BossBot"
  },
  methods: {
    interpolateColor(color1, color2, factor) {
      const result = color1.slice(1).match(/.{2}/g).map((x, i) => {
        const c1 = parseInt(x, 16)
        const c2 = parseInt(color2.slice(1).match(/.{2}/g)[i], 16)
        const c = Math.round(c1 + factor * (c2 - c1))
        return c.toString(16).padStart(2, '0')
      })
      return `#${result.join('')}`
    },
    convertUmaDez(value){
      if (value == 1){
        return 10
      }else if (value == 2){
        return 20
      }else if (value == 3){
        return 30
      }else if (value == 4){
        
      }
    },
    getColor(value) {
      const colors = [
        '#008000', // Verde
        '#0080FF', // Azul
        '#FFFF00', // Roxo
        '#FF8F00', // Amarelo
        '#FF0000'  // Vermelho
      ]
      
      const totalSegments = colors.length - 1
      const segmentLength = 101 / totalSegments
      const segmentIndex = Math.floor(value / segmentLength)
      const segmentFactor = (value % segmentLength) / segmentLength

      return this.interpolateColor(
        colors[segmentIndex],
        colors[segmentIndex + 1],
        segmentFactor
      )
    }
  }
}
</script>

<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>
