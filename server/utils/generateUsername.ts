// Function to generate unique username

export async function generateUniqueUsername(
  name: string | undefined | null,
  collection: any
): Promise<string> {
  if (!name) {
    return `user-${Date.now()}`;
  }

  const baseUsername = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

  const existingWithUsername = await collection
    .find({
      username: new RegExp(`^${baseUsername}(-\\d+)?$`),
    })
    .toArray();

  if (existingWithUsername.length === 0) {
    return baseUsername;
  }

  const usernames = existingWithUsername.map(
    (u: { username: string }) => u.username
  );
  let maxNum = 0;

  usernames.forEach((username: string) => {
    const match = username.match(/-(\d+)$/);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  });

  return `${baseUsername}-${maxNum + 1}`;
}
