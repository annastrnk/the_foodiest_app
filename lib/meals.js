// import fs from 'node:fs';
import { S3 } from '@aws-sdk/client-s3';
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
  const { rows } =  await sql`SELECT * FROM meals`;
  return rows;
}


export async function getMeal(slug) {
  const { rows } = await sql`SELECT * FROM meals WHERE slug = ${slug}`;
  return rows[0];
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split('.').pop();
  const fileName = `${meal.slug}.${extension}`;

  const bufferedImage = await meal.image.arrayBuffer();

  await s3.putObject({
    Bucket: 'annastarenka-nextjs-demo-users-image',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  meal.image = fileName;

  await sql`
    INSERT INTO meals (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      ${meal.title},
      ${meal.summary},
      ${meal.instructions},
      ${meal.creator},
      ${meal.creator_email},
      ${meal.image},
      ${meal.slug}
    )
  `;
}


