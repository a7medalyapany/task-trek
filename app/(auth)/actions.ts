'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import * as Yup from 'yup'

const authSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  name: Yup.string().min(3, "Name must be at least 3 characters")
})

async function validateForm(data: { email: string; password: string; 
  name?: string 
}) {
  try {
    await authSchema.validate(data, { abortEarly: false })
    return null
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return error.inner.reduce((acc, err) => {
        acc[err.path!] = err.message
        return acc
      }, {} as Record<string, string>)
    }
    return { general: 'An unexpected error occurred' }
  }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validationErrors = await validateForm(data)
  if (validationErrors) {
    return { errors: validationErrors }
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { errors: { general: 'Invalid credentials. Please try again.' } }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    name: formData.get('name') as string,
  }

  const validationErrors = await validateForm(data)
  if (validationErrors) {
    return { errors: validationErrors }
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        email: data.email,
        avatar_url: `https://ui-avatars.com/api/?name=${data.name}&background=random&color=fff`,
      }
    },
  })

  if (error) {
    return { errors: { general: 'Unable to create account. Please try again.' } }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut () {
  const supabase =  await createClient();
  supabase.auth.signOut();
  return redirect("/login");
}
