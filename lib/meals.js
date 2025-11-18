import { S3 } from '@aws-sdk/client-s3';
import clientPromise, { getDbName } from './mongodb';
import slugify from 'slugify';
import xss from 'xss';

const s3 = new S3({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getMeals() {
  const client = await clientPromise;
  const db = client.db(getDbName());
  const meals = await db.collection('meals').find({}).toArray();
  return meals;
}


export async function getMeal(slug) {
  const client = await clientPromise;
  const db = client.db(getDbName());
  const meal = await db.collection('meals').findOne({ slug });
  
  return meal;
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;

  const bufferedImage = Buffer.from(await meal.image.arrayBuffer());;

  await s3.putObject({
    Bucket: 'annastarenka-nextjs-demo-users-image',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = fileName;

  const client = await clientPromise;
  const db = client.db(getDbName());
  
  await db.collection('meals').updateOne(
    { slug: meal.slug },
    {
      $setOnInsert: {
        title: meal.title,
        summary: meal.summary,
        instructions: meal.instructions,
        creator: meal.creator,
        creator_email: meal.creator_email,
        image: meal.image,
        slug: meal.slug,
      },
    },
    { upsert: true }
  );
  
  return { success: true, slug: meal.slug };
}


