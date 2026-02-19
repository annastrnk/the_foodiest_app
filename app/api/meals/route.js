import { NextResponse } from 'next/server';
import { getMeals } from '@/lib/meals'; 

export async function GET() {
  try {
    const meals = await getMeals();
    return NextResponse.json(meals);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}