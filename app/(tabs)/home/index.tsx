import { YStack, Text, Button } from 'tamagui'
import { useState } from 'react'
import { Router } from 'expo-router'


import ParentDashboard from '../../(roles)/parent'
import SurrogateDashboard from '../../(roles)/surrogate'
import AgentDashboard from '../../(roles)/agent'


const role: 'parent' | 'surrogate' | 'agent' = 'surrogate' //we need to make this global in a store

export default function Home() {
  if (role === 'parent') return <ParentDashboard />
  if (role === 'surrogate') return <SurrogateDashboard />
  return <AgentDashboard />

}
