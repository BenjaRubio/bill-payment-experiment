'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAsUser(userId: number) {
  // save user id in cookie
  (await cookies()).set('user_id', userId.toString(), { path: '/' })
  redirect('/')
}

export async function logout() {
  (await cookies()).delete('user_id')
  redirect('/')
}