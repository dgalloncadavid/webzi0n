/* Aviso breve en la parte inferior (2 s). Un solo toast por página. */
import { ref } from 'vue'

const message = ref('')
const visible = ref(false)
let timer = null

export function useToast() {
  function show(m) {
    message.value = m
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, 2000)
  }
  return { message, visible, show }
}
