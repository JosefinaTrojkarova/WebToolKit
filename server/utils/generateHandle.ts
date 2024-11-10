// Function to generate unique handle

export async function generateUniqueHandle(
  name: string | undefined | null,
  collection: any
): Promise<string> {
  if (!name) {
    return `user-${Date.now()}`;
  }

  const baseHandle = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

  const existingWithHandle = await collection
    .find({
      handle: new RegExp(`^${baseHandle}(-\\d+)?$`),
    })
    .toArray();

  if (existingWithHandle.length === 0) {
    return baseHandle;
  }

  const handles = existingWithHandle.map((u: { handle: string }) => u.handle);
  let maxNum = 0;

  handles.forEach((handle: string) => {
    const match = handle.match(new RegExp(`^${baseHandle}-?(\\d*)$`));
    if (match && match[1]) {
      const num = parseInt(match[1]);
      if (num > maxNum) maxNum = num;
    }
  });

  return `${baseHandle}-${maxNum + 1}`;
}
