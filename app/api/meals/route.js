import { NextResponse } from 'next/server';
import { getMeals } from '@/lib/meals'; 

export async function GET() {
  try {
    const meals = await getMeals();
    // Повертаємо дані як JSON
    return NextResponse.json(meals);
  } catch (error) {
    return NextResponse.json({ error: 'Помилка бази даних' }, { status: 500 });
  }
}