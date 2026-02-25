import { NextResponse } from 'next/server';
import { getMeals, saveMeal } from '@/lib/meals'; 

export async function GET() {
  try {
    const meals = await getMeals();
    return NextResponse.json(meals);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData(); 
    
    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      instructions: formData.get('instructions'),
      creator: formData.get('creator'),
      creator_email: formData.get('creator_email'),
      image: formData.get('image'), 
      isGlutenFree: formData.get('isGlutenFree') === 'true',
      isLactoseFree: formData.get('isLactoseFree') === 'true',
      isVegan: formData.get('isVegan') === 'true',
      isVegetarian: formData.get('isVegetarian') === 'true',
    };

    if (!meal.image) {
      return NextResponse.json({ message: 'Missing image' }, { status: 400 });
    }

    const result = await saveMeal(meal);
    return NextResponse.json(result, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}