<template>
  <div class="simple-date-picker">
    <div class="picker-row">
      <div class="picker-item picker-item-year">
        <select 
          v-model="selectedYear" 
          @change="updateDate"
          class="picker-select"
        >
          <option value="" disabled>年</option>
          <option 
            v-for="year in years" 
            :key="year" 
            :value="year"
          >
            {{ year }}年
          </option>
        </select>
      </div>
      <div class="picker-item picker-item-month">
        <select 
          v-model="selectedMonth" 
          @change="updateDate"
          class="picker-select"
        >
          <option value="" disabled>月</option>
          <option 
            v-for="month in months" 
            :key="month" 
            :value="month"
          >
            {{ month }}月
          </option>
        </select>
      </div>
      <div class="picker-item picker-item-day">
        <select 
          v-model="selectedDay" 
          @change="updateDate"
          class="picker-select"
        >
          <option value="" disabled>日</option>
          <option 
            v-for="day in days" 
            :key="day" 
            :value="day"
          >
            {{ day }}日
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

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
    return new Date()
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

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
  // 默认选择当天
  const defaultDate = new Date()
  return {
    year: defaultDate.getFullYear(),
    month: defaultDate.getMonth() + 1,
    day: defaultDate.getDate()
  }
}

const selectedYear = ref<number | ''>(initDate().year)
const selectedMonth = ref<number | ''>(initDate().month)
const selectedDay = ref<number | ''>(initDate().day)

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
  if (!selectedYear.value || !selectedMonth.value) {
    return []
  }
  const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  const dayList: number[] = []
  for (let i = 1; i <= daysInMonth; i++) {
    dayList.push(i)
  }
  return dayList
})

// 更新日期值
const updateDate = () => {
  if (!selectedYear.value || !selectedMonth.value || !selectedDay.value) {
    return
  }
  
  // 确保日期有效
  const maxDay = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  if (selectedDay.value > maxDay) {
    selectedDay.value = maxDay
  }
  
  const dateStr = `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-${String(selectedDay.value).padStart(2, '0')}`
  emit('update:modelValue', dateStr)
}

// 监听月份和年份变化，更新日期范围
watch([selectedYear, selectedMonth], () => {
  if (selectedYear.value && selectedMonth.value && selectedDay.value) {
    const maxDay = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
    if (selectedDay.value > maxDay) {
      selectedDay.value = maxDay
    }
  }
  updateDate()
})

// 监听外部值变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const date = new Date(newVal)
    selectedYear.value = date.getFullYear()
    selectedMonth.value = date.getMonth() + 1
    selectedDay.value = date.getDate()
  }
})

onMounted(() => {
  updateDate()
})
</script>

<style lang="scss" scoped>
.simple-date-picker {
  width: 100%;
  
  .picker-row {
    display: flex;
    gap: 12px;
    align-items: center;
    
    .picker-item {
      flex: 1;

      .picker-select {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid rgba(102, 126, 234, 0.2);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.95);
        color: #1e293b;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 16px center;
        background-size: 12px;
        padding-right: 40px;
        
        &:hover {
          border-color: rgba(102, 126, 234, 0.4);
          background-color: rgba(255, 255, 255, 1);
        }
        
        &:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        option {
          padding: 10px;
          background: white;
          color: #1e293b;
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .picker-item-year {
      flex: 1.4;
      min-width: 120px;
    }

    .picker-item-month,
    .picker-item-day {
      min-width: 90px;
    }
  }
}

// 移动端优化
@media (max-width: 768px) {
  .simple-date-picker {
    .picker-row {
      gap: 8px;
      
      .picker-item {
        .picker-select {
          padding: 14px 16px;
          font-size: 16px; // 移动端字体稍大，防止缩放
          padding-right: 40px;
        }
      }
    }
  }
}

// 深色模式支持（如果需要）
@media (prefers-color-scheme: dark) {
  .simple-date-picker {
    .picker-row {
      .picker-item {
        .picker-select {
          background: rgba(30, 41, 59, 0.95);
          color: #f1f5f9;
          border-color: rgba(102, 126, 234, 0.3);
          
          option {
            background: #1e293b;
            color: #f1f5f9;
          }
        }
      }
    }
  }
}
</style>

