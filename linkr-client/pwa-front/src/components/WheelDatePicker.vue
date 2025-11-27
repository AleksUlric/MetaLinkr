<template>
  <div class="wheel-date-picker">
    <div class="picker-mask-top"></div>
    <div class="picker-mask-bottom"></div>
    <div class="picker-container">
      <div class="picker-column" ref="yearColumn">
        <div 
          v-for="year in years" 
          :key="year"
          class="picker-item"
          :class="{ active: selectedYear === year }"
          :data-value="year"
        >
          {{ year }}年
        </div>
      </div>
      <div class="picker-column" ref="monthColumn">
        <div 
          v-for="month in months" 
          :key="month"
          class="picker-item"
          :class="{ active: selectedMonth === month }"
          :data-value="month"
        >
          {{ month }}月
        </div>
      </div>
      <div class="picker-column" ref="dayColumn">
        <div 
          v-for="day in days" 
          :key="day"
          class="picker-item"
          :class="{ active: selectedDay === day }"
          :data-value="day"
        >
          {{ day }}日
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'

interface Props {
  modelValue?: string // YYYY-MM-DD 格式
  minDate?: Date
  maxDate?: Date
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  minDate: () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 100)
    return date
  },
  maxDate: () => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 18)
    return date
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const yearColumn = ref<HTMLElement>()
const monthColumn = ref<HTMLElement>()
const dayColumn = ref<HTMLElement>()

// 初始化日期
const initDate = () => {
  if (props.modelValue) {
    const date = new Date(props.modelValue)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }
  // 默认选择18年前的今天
  const defaultDate = new Date()
  defaultDate.setFullYear(defaultDate.getFullYear() - 18)
  return {
    year: defaultDate.getFullYear(),
    month: defaultDate.getMonth() + 1,
    day: defaultDate.getDate()
  }
}

const selectedYear = ref(initDate().year)
const selectedMonth = ref(initDate().month)
const selectedDay = ref(initDate().day)

// 生成年份列表
const years = computed(() => {
  const yearList: number[] = []
  const minYear = props.minDate.getFullYear()
  const maxYear = props.maxDate.getFullYear()
  for (let i = maxYear; i >= minYear; i--) {
    yearList.push(i)
  }
  return yearList
})

// 生成月份列表
const months = computed(() => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
})

// 生成日期列表
const days = computed(() => {
  const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  const dayList: number[] = []
  for (let i = 1; i <= daysInMonth; i++) {
    dayList.push(i)
  }
  return dayList
})

// 更新日期值
const updateDate = () => {
  // 确保日期有效
  const maxDay = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  if (selectedDay.value > maxDay) {
    selectedDay.value = maxDay
  }
  
  const dateStr = `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`
  emit('update:modelValue', dateStr)
}

// 监听选择变化
watch([selectedYear, selectedMonth, selectedDay], () => {
  updateDate()
}, { deep: true })

// 初始化滚动位置
const initScroll = () => {
  nextTick(() => {
    if (yearColumn.value && monthColumn.value && dayColumn.value) {
      scrollToValue(yearColumn.value, selectedYear.value, 'year')
      scrollToValue(monthColumn.value, selectedMonth.value, 'month')
      scrollToValue(dayColumn.value, selectedDay.value, 'day')
    }
  })
}

// 滚动到指定值
const scrollToValue = (column: HTMLElement | undefined, value: number, type: 'year' | 'month' | 'day') => {
  if (!column) return
  
  const items = column.querySelectorAll('.picker-item')
  let targetIndex = -1
  
  items.forEach((item, index) => {
    const itemValue = parseInt(item.getAttribute('data-value') || '0')
    if (type === 'year' && itemValue === value) {
      targetIndex = index
    } else if (type === 'month' && itemValue === value) {
      targetIndex = index
    } else if (type === 'day' && itemValue === value) {
      targetIndex = index
    }
  })
  
  if (targetIndex >= 0) {
    const itemHeight = 44 // 每个选项的高度
    const scrollTop = targetIndex * itemHeight
    column.scrollTop = scrollTop
  }
}

// 处理滚动事件
const handleScroll = (column: HTMLElement, type: 'year' | 'month' | 'day') => {
  const itemHeight = 44
  const scrollTop = column.scrollTop
  const index = Math.round(scrollTop / itemHeight)
  
  const items = column.querySelectorAll('.picker-item')
  if (items[index]) {
    const value = parseInt(items[index].getAttribute('data-value') || '0')
    
    if (type === 'year') {
      selectedYear.value = value
    } else if (type === 'month') {
      selectedMonth.value = value
    } else if (type === 'day') {
      selectedDay.value = value
    }
    
    // 平滑滚动到精确位置
    const targetScrollTop = index * itemHeight
    if (Math.abs(column.scrollTop - targetScrollTop) > 1) {
      column.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      })
    }
  }
}

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const date = new Date(newVal)
    selectedYear.value = date.getFullYear()
    selectedMonth.value = date.getMonth() + 1
    selectedDay.value = date.getDate()
    initScroll()
  }
})

onMounted(() => {
  initScroll()
  
  // 绑定滚动事件
  if (yearColumn.value) {
    yearColumn.value.addEventListener('scroll', () => handleScroll(yearColumn.value!, 'year'))
  }
  if (monthColumn.value) {
    monthColumn.value.addEventListener('scroll', () => handleScroll(monthColumn.value!, 'month'))
  }
  if (dayColumn.value) {
    dayColumn.value.addEventListener('scroll', () => handleScroll(dayColumn.value!, 'day'))
  }
  
  // 初始化日期
  updateDate()
})
</script>

<style lang="scss" scoped>
.wheel-date-picker {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: #fff;
  border-radius: 12px;
  
  .picker-mask-top,
  .picker-mask-bottom {
    position: absolute;
    left: 0;
    right: 0;
    height: 88px;
    pointer-events: none;
    z-index: 10;
  }
  
  .picker-mask-top {
    top: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0));
  }
  
  .picker-mask-bottom {
    bottom: 0;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0));
  }
  
  .picker-container {
    display: flex;
    height: 100%;
    padding: 88px 0;
    
    .picker-column {
      flex: 1;
      overflow-y: auto;
      scroll-snap-type: y mandatory;
      -webkit-overflow-scrolling: touch;
      
      &::-webkit-scrollbar {
        display: none;
      }
      
      .picker-item {
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #666;
        scroll-snap-align: center;
        transition: all 0.2s ease;
        cursor: pointer;
        
        &.active {
          color: #667eea;
          font-weight: 600;
          font-size: 18px;
        }
      }
    }
  }
  
  // 选中指示线
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 44px;
    pointer-events: none;
    z-index: 5;
    border-top: 1px solid rgba(102, 126, 234, 0.2);
    border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  }
  
  &::before {
    top: 88px;
  }
  
  &::after {
    bottom: 88px;
  }
}
</style>

