<template>
  <div>
    <Card />
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'VueAdminTemplateMasterIndex',
  components: {
    Card,
    Sale,
    Observe
  },

  data() {
    return {

    }
  },

  mounted() {
    this.$store.dispatch('getData')
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
