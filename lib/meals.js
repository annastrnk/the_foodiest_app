import { v2 as cloudinary } from "cloudinary";
import clientPromise, { getDbName } from "./mongodb";
import slugify from "slugify";
import xss from "xss";

cloudinary.config({
  cloud_name: "dopmzrbkk",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function getMeals() {
  const client = await clientPromise;
  const db = client.db(getDbName());
  const meals = await db.collection("meals").find({}).toArray();
  return meals;
}

export async function getMeal(slug) {
  const client = await clientPromise;
  const db = client.db(getDbName());
  const meal = await db.collection("meals").findOne({ slug });

  return meal;
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  const bufferedImage = Buffer.from(await meal.image.arrayBuffer());
  const base64Image = `data:image/${extension};base64,${bufferedImage.toString("base64")}`;
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "food_app",
    });

    meal.image = uploadResponse.secure_url;

    const client = await clientPromise;
    const db = client.db(getDbName());

    await db.collection("meals").insertOne({
      title: meal.title,
      summary: meal.summary,
      instructions: meal.instructions,
      creator: meal.creator,
      creator_email: meal.creator_email,
      image: meal.image,
      slug: meal.slug,
      isGlutenFree: !!meal.isGlutenFree,
      isLactoseFree: !!meal.isLactoseFree,
      isVegan: !!meal.isVegan,
      isVegetarian: !!meal.isVegetarian,
    });

    return { success: true, slug: meal.slug };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Saving meal failed.");
  }
}
