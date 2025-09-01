import { createTamagui } from 'tamagui'
import { tokens, themes } from '@tamagui/themes'

const appTokens = {
  color: {
    primary: { val: '#0E0E55' },
    secondary: { val: '#8080FF' },
    background: { val: '#F9F9FB' },
    text: { val: '#1E1E1E' },
    success: { val: '#22C55E' },  // green
    warning: { val: '#FACC15' },  // yellow
    danger: { val: '#EF4444' },   // red
  },
}

const appThemes = {
  light: {
    background: appTokens.color.background.val,
    color: appTokens.color.text.val,
    primary: appTokens.color.primary.val,
    secondary: appTokens.color.secondary.val,
  },
  dark: {
    background: '#0E0E55',
    color: '#FFFFFF',
    primary: '#8080FF',
    secondary: '#B3B3FF',
  },
}

const config = createTamagui({
  tokens: {
    ...tokens,
    color: {
      primary: '#0E0E55' ,
      secondary: '#8080FF' ,
      background:'#ffffff',
      text:'#000000',
      success: '#4CAF50',
      warning:'#FFC107',
      danger:'#F44336',
    },
  },
  themes: {
    light: {
      background: '#ffffff',
      color: '#000000',
    },
    dark: {
      background: '#000000',
      color: '#ffffff',
    },
  },
    shorthands: {
    p: 'padding',
    m: 'margin',
    w: 'width',
    h: 'height',
    f: 'flex',
    ai: 'alignItems',
    jc: 'justifyContent',
  }
})


export type AppConfig = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
