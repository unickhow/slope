import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      input__field: 'p-2 rounded-md border',
      button: 'py-2 px-4 rounded-md cursor-pointer bg-transparent border border-primary text-primary transform active:translate-y-[1px] flex items-center justify-center gap-1',
      'button-primary': 'bg-primary text-white border-primary',
      'button-ghost': 'text-primary border-none',
      'is-disabled': 'opacity-30 cursor-not-allowed active:translate-y-0'
    }
  ],
  theme: {
    colors: {
      primaryLightest: '#FFDAD8',
      primary: '#E6554C',
      secondary: '#ED8078'
    }
  },
  presets: [
    presetUno(),
    presetIcons()
  ]
})
