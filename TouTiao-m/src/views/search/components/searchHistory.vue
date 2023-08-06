<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <template v-slot:right-icon>
        <div v-if="isDeleteShow">
          <span @click="onDeleteAllItem">全部删除</span>
          &nbsp;&nbsp;
          <span @click="onChangeDeleteStatus(false)">完成</span>
        </div>
        <van-icon size="18" v-else name="delete-o" @click="onChangeDeleteStatus(true)" />
      </template>
    </van-cell>
    <van-cell
      v-for="(title, index) in dataList"
      :key="index"
      :title="title"
      @click="onCellItemClick(title)"
    >
      <template v-slot:right-icon>
        <van-icon size="14" name="close" v-if="isDeleteShow" />
      </template>
    </van-cell>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onBeforeMount, onMounted, watch, ref } from 'vue'
interface DataProps {}
export default {
  name: 'SearchHistory',
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  emits: ['delete', 'search'],
  setup(props: any, { emit }) {
    const data: DataProps = reactive({})
    const isDeleteShow = ref(false)
    const dataList = ref([])
    watch(
      () => props.list,
      () => {
        console.log('watch list: ', props.list)
        dataList.value = props.list || []
      },
      {
        immediate: true
      }
    )

    const onChangeDeleteStatus = (isShow: boolean) => {
      isDeleteShow.value = isShow
    }

    const onCellItemClick = (title: string) => {
      if (isDeleteShow.value) {
        // 删除
        emit('delete', title, 'single')
      } else {
        // 搜索
        emit('search', title)
      }
    }

    const onDeleteAllItem = () => {
      emit('delete', '', 'all')
    }

    onBeforeMount(() => {})
    onMounted(() => {})
    const refData = toRefs(data)
    return {
      ...refData,
      dataList,
      isDeleteShow,
      onChangeDeleteStatus,
      onCellItemClick,
      onDeleteAllItem
    }
  }
}
</script>
<style scoped lang="less"></style>
