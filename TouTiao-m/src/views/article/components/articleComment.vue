<template>
  <div class="container">???</div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'

interface DataProps {}

export default {
  name: 'ArticleComment',
  props: {},
  setup() {
    const data: DataProps = reactive({})
    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    return {
      ...refData
    }
  }
}
</script>
<style scoped lang="less"></style>
